"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTypeUsagesMap = void 0;
const graphql_1 = require("graphql");
/**
 * Searches for references of all types inside fragments and constructs
 * a usage map from those references.
 *
 * For example:
 * fragment A on Foo {
 *   posts {
 *     author { firstname }
 *   }
 * }
 * fragment B on Post {
 *   myCategory: category {
 *     moderator { lastname }
 *   }
 * }
 *
 * Will end up with the following map:
 * {
 *   Foo: {
 *     A: [ { name: { value: "posts", selectionSet: {...} } } ]
 *   },
 *   Post: {
 *     A__posts: [ { name: {value: "author"}, selectionSet: {...} } ],
 *     B: [{ name: {value: "myCategory", selectionSet: {...}} }]
 *   },
 *   User: {
 *     A__posts__author: [ {name: {value: "firstname"} }],
 *     B__myCategory__moderator: [ {name: {value: "lastname"} }],
 *   },
 *   Category: {
 *     B_myCategory: [ {name: {value: "moderator"}, selectionSet: {...} } ]
 *   }
 * }
 */
function buildTypeUsagesMap(args) {
    const fullDocument = {
        kind: graphql_1.Kind.DOCUMENT,
        definitions: args.fragments,
    };
    const typeInfo = new graphql_1.TypeInfo(args.schema);
    const typeUsagesMap = new Map();
    const typeUsagePath = [];
    (0, graphql_1.visit)(fullDocument, (0, graphql_1.visitWithTypeInfo)(typeInfo, {
        FragmentDefinition: {
            enter(node) {
                typeUsagePath.push(node.name.value);
            },
            leave() {
                typeUsagePath.pop();
            },
        },
        InlineFragment: {
            enter(_, key) {
                typeUsagePath.push(String(key));
            },
            leave() {
                typeUsagePath.pop();
            },
        },
        Field: {
            enter: node => {
                const parentType = typeInfo.getParentType();
                if (!parentType) {
                    const fragmentName = typeUsagePath[0];
                    const pathStr = typeUsagePath.join(`,`);
                    throw new Error(`Field "${node.name.value}" at path "${pathStr}" has no parent type. ` +
                        `This may indicate that your remote schema had changed ` +
                        `and your fragment "${fragmentName}" must be updated.`);
                }
                const typeUsageKey = typeUsagePath.join(`__`);
                if (!typeUsagesMap.has(parentType.name)) {
                    typeUsagesMap.set(parentType.name, new Map());
                }
                const typeFragments = typeUsagesMap.get(parentType.name);
                if (!typeFragments.has(typeUsageKey)) {
                    typeFragments.set(typeUsageKey, []);
                }
                const fragmentFields = typeFragments.get(typeUsageKey);
                fragmentFields.push(node);
                const alias = node.alias ? node.alias.value : node.name.value;
                typeUsagePath.push(alias);
            },
            leave: () => {
                typeUsagePath.pop();
            },
        },
    }));
    return typeUsagesMap;
}
exports.buildTypeUsagesMap = buildTypeUsagesMap;
//# sourceMappingURL=build-type-usages-map.js.map