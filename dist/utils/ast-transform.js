"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameNode = void 0;
function renameNode(node, convertName) {
    return {
        ...node,
        name: {
            ...node.name,
            value: convertName(node.name.value),
        },
    };
}
exports.renameNode = renameNode;
//# sourceMappingURL=ast-transform.js.map