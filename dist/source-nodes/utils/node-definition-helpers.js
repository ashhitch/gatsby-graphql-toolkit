"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGatsbyNodeDefinition = exports.findNodeOperationName = exports.collectNodeFieldOperationNames = exports.collectNodeOperationNames = exports.collectListOperationNames = void 0;
function collectListOperationNames(doc) {
    return collectOperationNames(doc, /^LIST/);
}
exports.collectListOperationNames = collectListOperationNames;
function collectNodeOperationNames(doc) {
    return collectOperationNames(doc, /^NODE/);
}
exports.collectNodeOperationNames = collectNodeOperationNames;
function collectNodeFieldOperationNames(doc) {
    return collectOperationNames(doc, /^NODE_FIELD/);
}
exports.collectNodeFieldOperationNames = collectNodeFieldOperationNames;
function collectOperationNames(document, regex) {
    return document.definitions
        .filter((def) => def.kind === "OperationDefinition")
        .map(def => (def.name ? def.name.value : ``))
        .filter(name => regex.test(name));
}
function findNodeOperationName(def) {
    const operationName = collectNodeOperationNames(def.document)[0];
    if (!operationName) {
        throw new Error(`Could not find node re-fetching operation for ${def.remoteTypeName}`);
    }
    return operationName;
}
exports.findNodeOperationName = findNodeOperationName;
function getGatsbyNodeDefinition(context, remoteTypeName) {
    const nodeDefinition = context.gatsbyNodeDefs.get(remoteTypeName);
    if (!nodeDefinition) {
        throw new Error(`Missing Gatsby node definition for remote type ${remoteTypeName}`);
    }
    return nodeDefinition;
}
exports.getGatsbyNodeDefinition = getGatsbyNodeDefinition;
//# sourceMappingURL=node-definition-helpers.js.map