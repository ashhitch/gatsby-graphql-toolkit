"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTypeDefinitions = exports.buildTypeDefinition = void 0;
const graphql_1 = require("graphql");
const build_fields_1 = require("./build-fields");
const resolve_remote_type_1 = require("./utils/resolve-remote-type");
// TODO: Pass only the very necessary args to builders as custom resolvers will stay in memory forever
//   and we don't want to capture too much scope
function unionType(context, type) {
    const { gatsbyApi: { schema }, sourcingPlan: { fetchedTypeMap }, typeNameTransform, } = context;
    const types = context.schema
        .getPossibleTypes(type)
        .filter(type => fetchedTypeMap.has(type.name))
        .map(type => typeNameTransform.toGatsbyTypeName(type.name));
    if (!types.length) {
        return;
    }
    return schema.buildUnionType({
        name: typeNameTransform.toGatsbyTypeName(type.name),
        types,
        resolveType: (source) => {
            var _a;
            if ((_a = source === null || source === void 0 ? void 0 : source.internal) === null || _a === void 0 ? void 0 : _a.type) {
                return source.internal.type;
            }
            const remoteTypeName = (0, resolve_remote_type_1.resolveRemoteType)(context, source);
            if (remoteTypeName) {
                return typeNameTransform.toGatsbyTypeName(remoteTypeName);
            }
            return null;
        },
    });
}
function isGatsbyNode(source) {
    var _a;
    return (source === null || source === void 0 ? void 0 : source.internal) && ((_a = source === null || source === void 0 ? void 0 : source.internal) === null || _a === void 0 ? void 0 : _a.type);
}
function interfaceType(context, type) {
    const { gatsbyApi: { schema }, typeNameTransform, } = context;
    const typeConfig = {
        name: typeNameTransform.toGatsbyTypeName(type.name),
        fields: (0, build_fields_1.buildFields)(context, type.name),
        resolveType: (source) => {
            if (isGatsbyNode(source)) {
                return source.internal.type;
            }
            const remoteTypeName = (0, resolve_remote_type_1.resolveRemoteType)(context, source);
            if (remoteTypeName) {
                return typeNameTransform.toGatsbyTypeName(remoteTypeName);
            }
            return undefined;
        },
        extensions: { infer: false },
    };
    return schema.buildInterfaceType(typeConfig);
}
function objectType(context, type) {
    const { gatsbyApi: { schema }, typeNameTransform, } = context;
    const interfaces = collectGatsbyTypeInterfaces(context, type);
    const typeConfig = {
        name: typeNameTransform.toGatsbyTypeName(type.name),
        fields: (0, build_fields_1.buildFields)(context, type.name),
        interfaces,
        extensions: interfaces.includes(`Node`) ? { infer: false } : {},
    };
    return schema.buildObjectType(typeConfig);
}
function collectGatsbyTypeInterfaces(context, remoteType) {
    const { sourcingPlan: { fetchedTypeMap }, typeNameTransform, } = context;
    const ifaces = remoteType
        .getInterfaces()
        .filter(remoteIfaceType => fetchedTypeMap.has(remoteIfaceType.name))
        .map(remoteIfaceType => typeNameTransform.toGatsbyTypeName(remoteIfaceType.name));
    if (context.gatsbyNodeDefs.has(remoteType.name)) {
        ifaces.push(`Node`);
    }
    return ifaces;
}
function enumType(context, remoteType) {
    const { gatsbyApi: { schema }, typeNameTransform, } = context;
    const typeConfig = {
        name: typeNameTransform.toGatsbyTypeName(remoteType.name),
        values: remoteType.getValues().reduce((acc, enumValue) => {
            acc[enumValue.name] = { name: enumValue.name };
            return acc;
        }, Object.create(null)),
    };
    return schema.buildEnumType(typeConfig);
}
function buildTypeDefinition(context, remoteTypeName) {
    const type = context.schema.getType(remoteTypeName);
    if ((0, graphql_1.isObjectType)(type)) {
        return objectType(context, type);
    }
    if ((0, graphql_1.isInterfaceType)(type)) {
        return interfaceType(context, type);
    }
    if ((0, graphql_1.isUnionType)(type)) {
        return unionType(context, type);
    }
    if ((0, graphql_1.isEnumType)(type)) {
        return enumType(context, type);
    }
    return undefined;
}
exports.buildTypeDefinition = buildTypeDefinition;
function buildTypeDefinitions(context) {
    const typeDefs = [];
    for (const typeName of collectTypesToCustomize(context)) {
        const typeDef = buildTypeDefinition(context, typeName);
        if (typeDef) {
            typeDefs.push(typeDef);
        }
    }
    return typeDefs;
}
exports.buildTypeDefinitions = buildTypeDefinitions;
function collectTypesToCustomize(context) {
    return new Set([
        ...context.sourcingPlan.fetchedTypeMap.keys(),
        ...context.gatsbyNodeDefs.keys(),
    ]);
}
//# sourceMappingURL=build-types.js.map