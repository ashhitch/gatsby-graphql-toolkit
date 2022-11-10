"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blog_schema_1 = require("./test-utils/blog-schema");
const build_fields_1 = require("../build-fields");
const test_utils_1 = require("../../__tests__/test-utils");
const build_types_1 = require("../build-types");
describe(`Collect fields from queries`, () => {
    it(`collects empty object when nothing is queried`, () => {
        const objFields = (0, build_fields_1.buildFields)((0, blog_schema_1.createTestContext)(), `Author`);
        const interfaceFields = (0, build_fields_1.buildFields)((0, blog_schema_1.createTestContext)(), `Entry`);
        expect(objFields).toEqual({});
        expect(interfaceFields).toEqual({});
    });
    it.todo(`collects all fields referenced in queries for this type`);
    it.todo(`additionally collects fields from all type interfaces for object types`);
    it(`collects field aliases as type fields`, () => {
        const entryFields = buildTypeFields(`Category`, [
            {
                remoteTypeName: `Category`,
                queries: `{
          categories {
            entries { id }
            aliasedEntries: entries { id }
            displayName
            aliasedDisplayName: displayName
          }
        }`,
            },
        ]);
        expect(Object.keys(entryFields !== null && entryFields !== void 0 ? entryFields : {})).toHaveLength(4);
        expect(entryFields).toMatchObject({
            aliasedDisplayName: {
                type: "String!",
            },
            aliasedEntries: {
                type: "[TestApiEntry]",
            },
            displayName: {
                type: "String!",
            },
            entries: {
                type: "[TestApiEntry]",
            },
        });
    });
    it.todo(`correctly skips __typename field`);
    it.todo(`collects fields of type object`);
    it.todo(`collects fields of type object with listOf and nonNull wrappers`);
    it.todo(`collects fields of gatsby node types`);
    it.todo(`collects fields of gatsby node types with listOf and nonNull wrappers`);
    it.todo(`collects fields of interface type`);
    it.todo(`collects fields of interface type with listOf and nonNull wrappers`);
    it.todo(`collects fields of union type`);
    it.todo(`collects fields of union type with listOf and nonNull wrappers`);
    it.todo(`collects fields of internal scalar types`);
    it.todo(`collects fields of internal scalar types with listOf and nonNull wrappers`);
    it.todo(`collects fields of custom scalar types`);
    it.todo(`collects fields of custom scalar types with listOf and nonNull wrappers`);
    it.todo(`collects enum fields`);
    it.todo(`collects enum fields with listOf and nonNull wrappers`);
    it.todo(`collects and transforms paginated fields`);
});
describe(`Interface type fields`, () => {
    it(`collects all fields of interface type`, () => {
        const entryFields = buildTypeFields(`Entry`, [
            {
                remoteTypeName: `Category`,
                queries: `{ categories { entries { id } } }`,
            },
        ]);
        expect(Object.keys(entryFields !== null && entryFields !== void 0 ? entryFields : {})).toHaveLength(1);
        expect(entryFields).toEqual({
            id: { type: `ID!` },
        });
    });
    it(`adds aliased __typename to interface fields`, () => {
        const entryFields = buildTypeFields(`Entry`, [
            {
                remoteTypeName: `Category`,
                queries: `{ categories { entries { remoteTypeName: __typename } } }`,
            },
        ]);
        expect(Object.keys(entryFields !== null && entryFields !== void 0 ? entryFields : {})).toHaveLength(1);
        expect(entryFields).toEqual({
            remoteTypeName: { type: `String!` },
        });
    });
    it(`doesn't add fields referenced in implementations only`, () => {
        const entryFields = buildTypeFields(`Entry`, [
            {
                remoteTypeName: `Author`,
                queries: `{ author { id } }`,
            },
        ]);
        expect(entryFields).toEqual({});
    });
    it(`adds fields from inline fragments defined on interface`, () => {
        const entryFields = buildTypeFields(`Entry`, [
            {
                remoteTypeName: `Author`,
                queries: `{ author { ...on Entry { id } } }`,
            },
        ]);
        expect(entryFields).toEqual({
            id: { type: `ID!` },
        });
    });
    it(`adds fields from fragments defined on interface`, () => {
        const entryFields = buildTypeFields(`Entry`, [
            {
                remoteTypeName: `Author`,
                queries: `
          { author { ...EntryFragment } }
          fragment EntryFragment on Entry { id }
        `,
            },
        ]);
        expect(entryFields).toEqual({
            id: { type: `ID!` },
        });
    });
});
function buildTypeFields(remoteTypeName, nodeDefs) {
    const gatsbyNodeDefs = (0, test_utils_1.createGatsbyNodeDefinitions)(nodeDefs);
    const context = (0, blog_schema_1.createTestContext)({ gatsbyNodeDefs });
    const typeDef = (0, build_types_1.buildTypeDefinition)(context, remoteTypeName);
    // FIXME: export GatsbyGraphQLInterfaceType from gatsby
    // @ts-ignore
    return typeDef.config.fields;
}
//# sourceMappingURL=build-fields.test.js.map