"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNodeDefinitions = void 0;
/**
 * Simple utility that merges user-defined node type configs with compiled
 * queries for every node type, and produces a value suitable for
 * `gatsbyNodeDefs` option of sourcing config.
 */
function buildNodeDefinitions({ gatsbyNodeTypes, documents, }) {
    const definitions = new Map();
    gatsbyNodeTypes.forEach(config => {
        const document = documents.get(config.remoteTypeName);
        if (!document) {
            throw new Error(`Canot find GraphQL document for ${config.remoteTypeName}`);
        }
        definitions.set(config.remoteTypeName, {
            document,
            nodeQueryVariables: (id) => ({ ...id }),
            ...config,
        });
    });
    return definitions;
}
exports.buildNodeDefinitions = buildNodeDefinitions;
//# sourceMappingURL=build-node-definitions.js.map