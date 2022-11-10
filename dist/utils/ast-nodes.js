"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringValue = exports.boolValue = exports.skipDirective = exports.directive = exports.fragmentSpread = exports.namedType = exports.name = exports.arg = exports.field = exports.selectionSet = exports.inlineFragment = exports.fragmentDefinition = exports.document = void 0;
const graphql_1 = require("graphql");
function document(definitions) {
    return {
        kind: graphql_1.Kind.DOCUMENT,
        definitions,
    };
}
exports.document = document;
function fragmentDefinition(fragmentName, typeName, selections) {
    return {
        kind: graphql_1.Kind.FRAGMENT_DEFINITION,
        name: name(fragmentName !== null && fragmentName !== void 0 ? fragmentName : typeName),
        typeCondition: namedType(typeName),
        selectionSet: selectionSet(selections),
    };
}
exports.fragmentDefinition = fragmentDefinition;
function inlineFragment(typeCondition, selections) {
    return {
        kind: graphql_1.Kind.INLINE_FRAGMENT,
        typeCondition: namedType(typeCondition),
        selectionSet: selectionSet(selections),
    };
}
exports.inlineFragment = inlineFragment;
function selectionSet(selections = []) {
    return {
        kind: graphql_1.Kind.SELECTION_SET,
        selections: selections,
    };
}
exports.selectionSet = selectionSet;
function field(fieldName, alias, args, selections, directives) {
    return {
        kind: graphql_1.Kind.FIELD,
        name: name(fieldName),
        alias: alias ? name(alias) : undefined,
        arguments: args,
        selectionSet: selectionSet(selections),
        directives,
    };
}
exports.field = field;
function arg(argName, value) {
    return {
        kind: graphql_1.Kind.ARGUMENT,
        name: name(argName),
        value,
    };
}
exports.arg = arg;
function name(value) {
    return {
        kind: graphql_1.Kind.NAME,
        value: value,
    };
}
exports.name = name;
function namedType(typeName) {
    return {
        kind: graphql_1.Kind.NAMED_TYPE,
        name: name(typeName),
    };
}
exports.namedType = namedType;
function fragmentSpread(fragmentName) {
    return {
        kind: graphql_1.Kind.FRAGMENT_SPREAD,
        name: name(fragmentName),
    };
}
exports.fragmentSpread = fragmentSpread;
function directive(directiveName, args) {
    return {
        kind: graphql_1.Kind.DIRECTIVE,
        name: name(directiveName),
        arguments: args,
    };
}
exports.directive = directive;
function skipDirective(condition = true) {
    return directive(`skip`, [arg(`if`, boolValue(condition))]);
}
exports.skipDirective = skipDirective;
function boolValue(value) {
    return {
        kind: graphql_1.Kind.BOOLEAN,
        value,
    };
}
exports.boolValue = boolValue;
function stringValue(value) {
    return {
        kind: graphql_1.Kind.STRING,
        value,
    };
}
exports.stringValue = stringValue;
//# sourceMappingURL=ast-nodes.js.map