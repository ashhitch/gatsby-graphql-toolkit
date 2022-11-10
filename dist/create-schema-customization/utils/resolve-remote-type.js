"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRemoteType = void 0;
function resolveRemoteType(context, source) {
    if (!source || typeof source !== `object`) {
        return undefined;
    }
    const typeNameField = context.gatsbyFieldAliases[`__typename`];
    const remoteTypeName = source[typeNameField];
    return typeof remoteTypeName === `string` ? remoteTypeName : undefined;
}
exports.resolveRemoteType = resolveRemoteType;
//# sourceMappingURL=resolve-remote-type.js.map