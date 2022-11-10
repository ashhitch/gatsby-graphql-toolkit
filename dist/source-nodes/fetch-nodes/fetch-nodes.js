"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNodeById = exports.fetchNodesById = exports.fetchNonNullishNodesById = void 0;
const graphql_1 = require("graphql");
const util_1 = require("util");
const node_definition_helpers_1 = require("../utils/node-definition-helpers");
const field_path_utils_1 = require("../utils/field-path-utils");
const fetch_node_fields_1 = require("./fetch-node-fields");
async function* fetchNonNullishNodesById(context, remoteTypeName, ids) {
    let index = 0;
    for await (const node of fetchNodesById(context, remoteTypeName, ids)) {
        if (!node) {
            throw new Error(`Node "${remoteTypeName}" with id "${(0, util_1.inspect)(ids[index])}" is nullish.`);
        }
        index++;
        yield node;
    }
}
exports.fetchNonNullishNodesById = fetchNonNullishNodesById;
async function* fetchNodesById(context, remoteTypeName, ids) {
    const { gatsbyApi, formatLogMessage } = context;
    const { reporter } = gatsbyApi;
    const nodeDefinition = (0, node_definition_helpers_1.getGatsbyNodeDefinition)(context, remoteTypeName);
    const activity = reporter.activityTimer(formatLogMessage(`fetching ${nodeDefinition.remoteTypeName}`));
    activity.start();
    try {
        // TODO: we can probably batch things here
        const promises = ids.map(id => fetchNodeById(context, remoteTypeName, id));
        for await (const node of promises) {
            yield node;
        }
    }
    finally {
        activity.end();
    }
}
exports.fetchNodesById = fetchNodesById;
async function fetchNodeById(context, remoteTypeName, id) {
    var _a;
    const nodeDefinition = (0, node_definition_helpers_1.getGatsbyNodeDefinition)(context, remoteTypeName);
    const operationName = (0, node_definition_helpers_1.findNodeOperationName)(nodeDefinition);
    const document = nodeDefinition.document;
    const variables = nodeDefinition.nodeQueryVariables(id);
    const query = (0, graphql_1.print)(document);
    const nodeFieldPath = (0, field_path_utils_1.findNodeFieldPath)(document, operationName);
    const result = await context.execute({
        query,
        operationName,
        document,
        variables,
    });
    if (!result.data) {
        let message = `Failed to execute query ${operationName}.`;
        if ((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length) {
            message += ` First error :\n  ${result.errors[0].message}`;
        }
        throw new Error(message);
    }
    const nodeOrArray = (0, field_path_utils_1.getFirstValueByPath)(result.data, nodeFieldPath);
    const node = Array.isArray(nodeOrArray) && nodeOrArray.length === 1
        ? nodeOrArray[0]
        : nodeOrArray;
    if (typeof node !== `object` || Array.isArray(node) || node === null) {
        return undefined;
    }
    return await (0, fetch_node_fields_1.addPaginatedFields)(context, nodeDefinition, node);
}
exports.fetchNodeById = fetchNodeById;
//# sourceMappingURL=fetch-nodes.js.map