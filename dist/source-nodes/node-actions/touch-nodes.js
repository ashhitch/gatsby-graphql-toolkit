"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.touchNodesByType = exports.touchNodes = void 0;
function touchNodes(context, excludeIds = new Set()) {
    context.gatsbyNodeDefs.forEach(def => touchNodesByType(context, def, excludeIds));
}
exports.touchNodes = touchNodes;
function touchNodesByType(context, def, excludeIds = new Set()) {
    const { gatsbyApi, typeNameTransform } = context;
    const { actions, getNodesByType } = gatsbyApi;
    const gatsbyTypeName = typeNameTransform.toGatsbyTypeName(def.remoteTypeName);
    const nodes = getNodesByType(gatsbyTypeName);
    for (const node of nodes) {
        if (!excludeIds.has(node.id)) {
            actions.touchNode(node);
        }
    }
}
exports.touchNodesByType = touchNodesByType;
//# sourceMappingURL=touch-nodes.js.map