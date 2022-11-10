"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNodeList = exports.fetchAllNodes = void 0;
const node_definition_helpers_1 = require("../utils/node-definition-helpers");
const paginate_1 = require("./paginate");
const fetch_node_fields_1 = require("./fetch-node-fields");
/**
 * Fetches and paginates remote nodes by type while reporting progress
 */
async function* fetchAllNodes(context, remoteTypeName, variables) {
    const { gatsbyApi, formatLogMessage } = context;
    const { reporter } = gatsbyApi;
    const nodeDefinition = (0, node_definition_helpers_1.getGatsbyNodeDefinition)(context, remoteTypeName);
    const activity = reporter.activityTimer(formatLogMessage(`fetching ${nodeDefinition.remoteTypeName}`));
    activity.start();
    try {
        const listOperations = (0, node_definition_helpers_1.collectListOperationNames)(nodeDefinition.document);
        for (const nodeListQuery of listOperations) {
            const nodes = fetchNodeList(context, remoteTypeName, nodeListQuery, variables);
            for await (const node of nodes) {
                yield node;
            }
        }
    }
    finally {
        activity.end();
    }
}
exports.fetchAllNodes = fetchAllNodes;
async function* fetchNodeList(context, remoteTypeName, listOperationName, variables) {
    const typeNameField = context.gatsbyFieldAliases["__typename"];
    const nodeDefinition = (0, node_definition_helpers_1.getGatsbyNodeDefinition)(context, remoteTypeName);
    const plan = (0, paginate_1.planPagination)(context, nodeDefinition.document, listOperationName, variables);
    for await (const page of (0, paginate_1.paginate)(context, plan)) {
        const partialNodes = plan.adapter.getItems(page.fieldValue);
        for (const node of partialNodes) {
            if (!node || node[typeNameField] !== remoteTypeName) {
                // Possible when fetching complex interface or union type fields
                // or when some node is `null`
                continue;
            }
            // TODO: run in parallel?
            yield (0, fetch_node_fields_1.addPaginatedFields)(context, nodeDefinition, node);
        }
    }
}
exports.fetchNodeList = fetchNodeList;
//# sourceMappingURL=fetch-lists.js.map