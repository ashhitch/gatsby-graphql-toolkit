"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSourcingPlan = void 0;
const graphql_1 = require("graphql");
function buildSourcingPlan(args) {
    return {
        fetchedTypeMap: buildFetchedTypeMap(args),
        remoteNodeTypes: new Set(args.gatsbyNodeDefs.keys()),
    };
}
exports.buildSourcingPlan = buildSourcingPlan;
function buildFetchedTypeMap(args) {
    const schema = args.schema;
    const fetchedTypesMap = new Map();
    const typeInfo = new graphql_1.TypeInfo(schema);
    const Visitors = {
        collectTypeFields: {
            Field: (node) => {
                var _a, _b, _c, _d, _e;
                const parentTypeName = (_b = (_a = typeInfo.getParentType()) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ``;
                if (parentTypeName === ((_c = schema.getQueryType()) === null || _c === void 0 ? void 0 : _c.name) ||
                    parentTypeName === ((_d = schema.getMutationType()) === null || _d === void 0 ? void 0 : _d.name)) {
                    return;
                }
                const aliasNode = (_e = node.alias) !== null && _e !== void 0 ? _e : node.name;
                if (!fetchedTypesMap.has(parentTypeName)) {
                    fetchedTypesMap.set(parentTypeName, new Map());
                }
                const fetchedFields = fetchedTypesMap.get(parentTypeName);
                fetchedFields.set(aliasNode.value, {
                    alias: aliasNode.value,
                    name: node.name.value,
                });
            },
        },
        addUnionTypes: {
            Field: () => {
                // Union types must be added separately because they don't have fields
                //  by themselves and as such won't be added by `collectTypeFields`
                const type = typeInfo.getType();
                if (!type) {
                    return;
                }
                const unionType = (0, graphql_1.getNamedType)(type);
                if (!(0, graphql_1.isUnionType)(unionType)) {
                    return;
                }
                if (!fetchedTypesMap.has(unionType.name)) {
                    fetchedTypesMap.set(unionType.name, new Map());
                }
            },
        },
        addEnumTypes: {
            Field: () => {
                // Enum types must be added separately as well
                const type = typeInfo.getType();
                if (!type) {
                    return;
                }
                const enumType = (0, graphql_1.getNamedType)(type);
                if (!(0, graphql_1.isEnumType)(enumType)) {
                    return;
                }
                if (!fetchedTypesMap.has(enumType.name)) {
                    fetchedTypesMap.set(enumType.name, new Map());
                }
            },
        },
    };
    const visitor = (0, graphql_1.visitWithTypeInfo)(typeInfo, (0, graphql_1.visitInParallel)([
        Visitors.collectTypeFields,
        Visitors.addUnionTypes,
        Visitors.addEnumTypes,
    ]));
    for (const [, def] of args.gatsbyNodeDefs) {
        // TODO: optimize visitorKeys
        (0, graphql_1.visit)(def.document, visitor);
    }
    return fetchedTypesMap;
}
//# sourceMappingURL=build-sourcing-plan.js.map