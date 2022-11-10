"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPaginatedFields = void 0;
const node_definition_helpers_1 = require("../utils/node-definition-helpers");
const paginate_1 = require("./paginate");
const field_path_utils_1 = require("../utils/field-path-utils");
async function addPaginatedFields(context, def, node) {
    var _a;
    const nodeFieldQueries = (0, node_definition_helpers_1.collectNodeFieldOperationNames)(def.document);
    const remoteId = context.idTransform.remoteNodeToId(node, def);
    const variables = def.nodeQueryVariables(remoteId);
    for (const fieldQuery of nodeFieldQueries) {
        const plan = (0, paginate_1.planPagination)(context, def.document, fieldQuery, variables);
        const pages = (0, paginate_1.paginate)(context, plan);
        const result = await (0, paginate_1.combinePages)(pages, plan);
        if (!result || !result.data) {
            continue;
        }
        const nodeRoot = (0, field_path_utils_1.findNodeFieldPath)(def.document, fieldQuery);
        const nodeData = (_a = (0, field_path_utils_1.getFirstValueByPath)(result.data, nodeRoot)) !== null && _a !== void 0 ? _a : {};
        Object.assign(node, nodeData);
    }
    return node;
}
exports.addPaginatedFields = addPaginatedFields;
//# sourceMappingURL=fetch-node-fields.js.map