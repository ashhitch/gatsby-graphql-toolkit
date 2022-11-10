"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceAllNodes = void 0;
const fetch_lists_1 = require("./fetch-nodes/fetch-lists");
const create_nodes_1 = require("./node-actions/create-nodes");
const sourcing_context_1 = require("./sourcing-context");
/**
 * Uses sourcing config to fetch all data from the remote GraphQL API
 * and create gatsby nodes (using Gatsby `createNode` action)
 */
async function sourceAllNodes(config) {
    // Context instance passed to every nested call
    const context = (0, sourcing_context_1.createSourcingContext)(config);
    const promises = [];
    for (const remoteNodeType of context.gatsbyNodeDefs.keys()) {
        const remoteNodes = (0, fetch_lists_1.fetchAllNodes)(context, remoteNodeType);
        const promise = (0, create_nodes_1.createNodes)(context, remoteNodeType, remoteNodes);
        promises.push(promise);
    }
    await Promise.all(promises);
}
exports.sourceAllNodes = sourceAllNodes;
//# sourceMappingURL=source-all-nodes.js.map