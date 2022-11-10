"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldTransformers = void 0;
const graphql_1 = require("graphql");
const resolve_remote_type_1 = require("../utils/resolve-remote-type");
// TODO: map args
// TODO: support pagination
function isListOrNonNullListType(type) {
    return (0, graphql_1.isListType)(type) || ((0, graphql_1.isNonNullType)(type) && (0, graphql_1.isListType)(type.ofType));
}
exports.fieldTransformers = [
    {
        // Scalars (with any wrappers, i.e. lists, non-null)
        test: ({ remoteField }) => (0, graphql_1.isScalarType)((0, graphql_1.getNamedType)(remoteField.type)),
        transform: ({ remoteField }) => {
            const namedType = (0, graphql_1.getNamedType)(remoteField.type);
            const typeName = (0, graphql_1.isSpecifiedScalarType)(namedType)
                ? String(namedType)
                : `JSON`;
            return {
                type: wrap(typeName, remoteField.type),
            };
        },
    },
    {
        // Enums (with any wrappers, i.e. lists, non-null)
        test: ({ remoteField }) => (0, graphql_1.isEnumType)((0, graphql_1.getNamedType)(remoteField.type)),
        transform: ({ remoteField, context }) => ({
            type: toGatsbyType(context, remoteField.type),
        }),
    },
    {
        // Non-gatsby-node objects (with any wrappers, i.e. lists, non-null)
        test: ({ remoteField, context }) => {
            const namedType = (0, graphql_1.getNamedType)(remoteField.type);
            return ((0, graphql_1.isObjectType)(namedType) && !context.gatsbyNodeDefs.has(namedType.name));
        },
        transform: ({ remoteField, context }) => ({
            type: toGatsbyType(context, remoteField.type),
        }),
    },
    {
        // Singular unions and interfaces
        test: ({ remoteField }) => (0, graphql_1.isAbstractType)((0, graphql_1.isNonNullType)(remoteField.type)
            ? remoteField.type.ofType
            : remoteField.type),
        transform: ({ remoteField, fieldInfo, context }) => {
            return {
                type: toGatsbyType(context, remoteField.type),
                resolve: (source, _, resolverContext) => {
                    var _a;
                    const value = source[fieldInfo.gatsbyFieldName];
                    return (_a = resolveNode(context, value, resolverContext)) !== null && _a !== void 0 ? _a : value;
                },
            };
        },
    },
    {
        // Lists of unions and interfaces
        test: ({ remoteField }) => isListOrNonNullListType(remoteField.type) &&
            (0, graphql_1.isAbstractType)((0, graphql_1.getNamedType)(remoteField.type)),
        transform: ({ remoteField, fieldInfo, context }) => {
            return {
                type: toGatsbyType(context, remoteField.type),
                resolve: (source, _, resolverContext) => {
                    var _a;
                    return mapListOfNodes(context, (_a = source[fieldInfo.gatsbyFieldName]) !== null && _a !== void 0 ? _a : [], resolverContext);
                },
            };
        },
    },
    {
        // Singular gatsby node objects (with any wrappers, i.e. list, non-null)
        test: ({ remoteField, context }) => {
            const namedType = (0, graphql_1.getNamedType)(remoteField.type);
            return (!isListOrNonNullListType(remoteField.type) &&
                (0, graphql_1.isObjectType)(namedType) &&
                context.gatsbyNodeDefs.has(namedType.name));
        },
        transform: ({ remoteField, fieldInfo, context }) => {
            return {
                type: toGatsbyType(context, remoteField.type),
                resolve: (source, _, resolverContext) => resolveNode(context, source[fieldInfo.gatsbyFieldName], resolverContext),
            };
        },
    },
    {
        // List of gatsby nodes
        test: ({ remoteField, context }) => {
            const namedType = (0, graphql_1.getNamedType)(remoteField.type);
            return (isListOrNonNullListType(remoteField.type) &&
                (0, graphql_1.isObjectType)(namedType) &&
                context.gatsbyNodeDefs.has(namedType.name));
        },
        transform: ({ remoteField, fieldInfo, context }) => {
            return {
                type: toGatsbyType(context, remoteField.type),
                resolve: (source, _, resolverContext) => {
                    var _a;
                    return mapListOfNodes(context, (_a = source[fieldInfo.gatsbyFieldName]) !== null && _a !== void 0 ? _a : [], resolverContext);
                },
            };
        },
    },
    // for finding unhandled types
    // {
    //  test: () => true,
    //  transform: ({ remoteField, fieldInfo }) => console.log(fieldInfo),
    // },
];
function toGatsbyType(context, remoteType) {
    const namedType = (0, graphql_1.getNamedType)(remoteType);
    const gatsbyTypeName = context.typeNameTransform.toGatsbyTypeName(namedType.name);
    return wrap(gatsbyTypeName, remoteType);
}
/**
 * Wraps a type with the NON_NULL and LIST_OF types of the referenced remote type
 * i.e. wrapType(`JSON`, myRemoteListOfJSONType) => `[JSON]`
 */
function wrap(typeName, remoteType) {
    let wrappedType = typeName;
    let currentRemoteType = remoteType;
    while ((0, graphql_1.isWrappingType)(currentRemoteType)) {
        if ((0, graphql_1.isListType)(currentRemoteType)) {
            wrappedType = `[${wrappedType}]`;
        }
        if ((0, graphql_1.isNonNullType)(currentRemoteType)) {
            wrappedType = `${wrappedType}!`;
        }
        currentRemoteType = currentRemoteType.ofType;
    }
    return wrappedType;
}
function mapListOfNodes(context, list, resolverContext) {
    return list.map(value => {
        var _a;
        return Array.isArray(value)
            ? mapListOfNodes(context, value, resolverContext)
            : (_a = resolveNode(context, value, resolverContext)) !== null && _a !== void 0 ? _a : value;
    });
}
function resolveNode(context, source, resolverContext) {
    const remoteTypeName = (0, resolve_remote_type_1.resolveRemoteType)(context, source);
    if (!source || !remoteTypeName) {
        return;
    }
    const def = context.gatsbyNodeDefs.get(remoteTypeName);
    if (!def) {
        return;
    }
    const id = context.idTransform.remoteNodeToGatsbyId(source, def);
    const type = context.typeNameTransform.toGatsbyTypeName(remoteTypeName);
    return resolverContext.nodeModel.getNodeById({ id, type });
}
//# sourceMappingURL=field-transformers.js.map