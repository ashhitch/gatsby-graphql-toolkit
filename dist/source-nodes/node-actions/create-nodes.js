"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNode = exports.createNodes = void 0;
const util_1 = require("util");
const process_remote_node_1 = require("./process-remote-node");
const node_definition_helpers_1 = require("../utils/node-definition-helpers");
async function createNodes(context, remoteTypeName, remoteNodes) {
    const typeNameField = context.gatsbyFieldAliases["__typename"];
    for await (const remoteNode of remoteNodes) {
        if (!remoteNode || remoteNode[typeNameField] !== remoteTypeName) {
            throw new Error(`Got unexpected node for type ${remoteTypeName}: ${(0, util_1.inspect)(remoteNode)}`);
        }
        await createNode(context, remoteNode);
    }
}
exports.createNodes = createNodes;
async function createNode(context, remoteNode) {
    const { gatsbyApi, gatsbyFieldAliases } = context;
    const { actions, createContentDigest } = gatsbyApi;
    const typeNameField = gatsbyFieldAliases["__typename"];
    const remoteTypeName = remoteNode[typeNameField];
    if (!remoteTypeName || typeof remoteTypeName !== `string`) {
        throw new Error(`Remote node doesn't have expected field ${typeNameField}:\n` +
            (0, util_1.inspect)(remoteNode));
    }
    const def = (0, node_definition_helpers_1.getGatsbyNodeDefinition)(context, remoteTypeName);
    // TODO: assert that all expected fields exist, i.e. remoteTypeName, remoteNodeId
    //   also assert that Gatsby internal field names are not used
    //   i.e. "internal", "id", "parent", "children", "__typename", etc
    //   (Technically this should be caught in fragments validation before running a query
    //   but we should probably double-check for safety)
    const id = context.idTransform.remoteNodeToGatsbyId(remoteNode, def);
    const nodeData = await (0, process_remote_node_1.processRemoteNode)(context, def, remoteNode);
    const node = {
        ...nodeData,
        id,
        parent: undefined,
        internal: {
            contentDigest: createContentDigest(remoteNode),
            type: context.typeNameTransform.toGatsbyTypeName(def.remoteTypeName),
        },
    };
    await actions.createNode(node);
    return id;
}
exports.createNode = createNode;
//# sourceMappingURL=create-nodes.js.map