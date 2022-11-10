"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGatsbyNodeDefinitions = void 0;
const graphql_1 = require("graphql");
function createGatsbyNodeDefinitions(defs) {
    const gatsbyNodeDefs = new Map();
    defs.forEach((def, index) => {
        var _a;
        // TODO: Proper config validation
        if (!def.remoteTypeName) {
            throw new Error(`Every node type definition is expected to have key "remoteTypeName". ` +
                `But definition at index ${index} has none.`);
        }
        const remoteTypeName = def.remoteTypeName;
        gatsbyNodeDefs.set(remoteTypeName, {
            remoteTypeName,
            document: (0, graphql_1.parse)((_a = def.queries) !== null && _a !== void 0 ? _a : ``),
            nodeQueryVariables: (id) => ({ ...id }),
            ...def,
        });
    });
    return gatsbyNodeDefs;
}
exports.createGatsbyNodeDefinitions = createGatsbyNodeDefinitions;
//# sourceMappingURL=create-node-definitions.js.map