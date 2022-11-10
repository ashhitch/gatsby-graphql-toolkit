"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_utils_1 = require("../../__tests__/test-utils");
const blog_schema_1 = require("./test-utils/blog-schema");
const build_types_1 = require("../build-types");
describe(`Build objectType`, () => {
    it(`creates config for simple object type`, () => {
        const def = (0, build_types_1.buildTypeDefinition)((0, blog_schema_1.createTestContext)(), `Country`);
        expect(def).toMatchObject({ kind: "OBJECT" });
    });
    it(`prefixes remote type name`, () => {
        const context = (0, blog_schema_1.createTestContext)({ gatsbyTypePrefix: "TestPrefix" });
        const def = (0, build_types_1.buildTypeDefinition)(context, `Country`);
        expect(def).toMatchObject({
            config: { name: "TestPrefixCountry" },
        });
    });
    it(`fixes collision of connection type names`, () => {
        const gatsbyNodeDefs = (0, test_utils_1.createGatsbyNodeDefinitions)([
            { remoteTypeName: `Post`, queries: `{ posts { id } }` },
        ]);
        const context = (0, blog_schema_1.createTestContext)({
            gatsbyTypePrefix: "TestPrefix",
            gatsbyNodeDefs,
        });
        const def = (0, build_types_1.buildTypeDefinition)(context, `PostConnection`);
        // Gatsby creates its own type TestPrefixPostConnection
        // for root-level allTestPrefixPost field.
        // So when there is a remote PostConnection type, it should not have the
        // same name "TestPrefixPostConnection".
        // We must rename it to something else
        expect(def).toMatchObject({
            config: { name: "TestPrefixPostConnection_Remote" },
        });
    });
    it(`doesn't set extensions for non-node object type`, () => {
        const def = (0, build_types_1.buildTypeDefinition)((0, blog_schema_1.createTestContext)(), `Country`);
        expect(def.config.extensions).toEqual({});
    });
    it(`sets "infer: false" extension for gatsby node type`, () => {
        const gatsbyNodeDefs = (0, test_utils_1.createGatsbyNodeDefinitions)([
            { remoteTypeName: `Author`, queries: `{ authors { id } }` },
        ]);
        const context = (0, blog_schema_1.createTestContext)({ gatsbyNodeDefs });
        const nodeDef = (0, build_types_1.buildTypeDefinition)(context, `Author`);
        const simpleDef = (0, build_types_1.buildTypeDefinition)(context, `Country`);
        expect(nodeDef).toMatchObject({
            config: {
                extensions: { infer: false },
            },
        });
        expect(simpleDef.config.extensions).toEqual({});
    });
    describe(`Interfaces`, () => {
        it(`doesn't add interfaces by default`, () => {
            const def = (0, build_types_1.buildTypeDefinition)((0, blog_schema_1.createTestContext)(), `Author`);
            expect(def).toMatchObject({
                config: { interfaces: [] },
            });
        });
        it(`adds Node interface to types configured as gatsby node`, () => {
            const gatsbyNodeDefs = (0, test_utils_1.createGatsbyNodeDefinitions)([
                {
                    remoteTypeName: `Author`,
                    queries: `{ authors { id } }`,
                },
            ]);
            const context = (0, blog_schema_1.createTestContext)({ gatsbyNodeDefs });
            const nodeDef = (0, build_types_1.buildTypeDefinition)(context, `Author`);
            expect(nodeDef).toMatchObject({
                config: { interfaces: [`Node`] },
            });
        });
        it(`doesn't add remote interfaces if they were not referenced in queried`, () => {
            // FIXME: maybe add if interface field was requested from any implementation?
            const gatsbyNodeDefs = (0, test_utils_1.createGatsbyNodeDefinitions)([
                {
                    remoteTypeName: `Author`,
                    queries: `{ authors { country { displayName } } }`,
                },
            ]);
            const context = (0, blog_schema_1.createTestContext)({ gatsbyNodeDefs });
            const nodeDef = (0, build_types_1.buildTypeDefinition)(context, `Author`);
            const simpleDef = (0, build_types_1.buildTypeDefinition)(context, `Country`);
            expect(nodeDef).toMatchObject({
                config: { interfaces: [`Node`] },
            });
            expect(simpleDef).toMatchObject({
                config: { interfaces: [] },
            });
        });
        it(`adds remote interfaces if they were referenced in queries`, () => {
            const gatsbyNodeDefs = (0, test_utils_1.createGatsbyNodeDefinitions)([
                {
                    remoteTypeName: `Author`,
                    queries: `{
            authors {
              country {
                ...on Named { displayName }
              }
            }
          }`,
                },
            ]);
            const context = (0, blog_schema_1.createTestContext)({ gatsbyNodeDefs });
            const nodeDef = (0, build_types_1.buildTypeDefinition)(context, `Author`);
            const simpleDef = (0, build_types_1.buildTypeDefinition)(context, `Country`);
            expect(nodeDef).toMatchObject({
                config: { interfaces: [`TestApiNamed`, `Node`] },
            });
            expect(simpleDef).toMatchObject({
                config: { interfaces: [`TestApiNamed`] },
            });
        });
    });
    describe(`Fields`, () => {
        // See build-fields.ts for a complete test suite
        it(`creates empty fields object by default`, () => {
            // Doesn't sound right but we validate against empty objects somewhere else
            const def = (0, build_types_1.buildTypeDefinition)((0, blog_schema_1.createTestContext)(), `Country`);
            expect(def.config.fields).toEqual({});
        });
        it(`adds fields referenced in node query`, () => {
            const gatsbyNodeDefs = (0, test_utils_1.createGatsbyNodeDefinitions)([
                {
                    remoteTypeName: `Author`,
                    queries: `{
            authors {
              id
              displayName
              country {
                ...on Named { displayName }
              }
              posts { id }
            }
          }`,
                },
            ]);
            const context = (0, blog_schema_1.createTestContext)({ gatsbyNodeDefs });
            const authorDef = (0, build_types_1.buildTypeDefinition)(context, `Author`);
            const countryDef = (0, build_types_1.buildTypeDefinition)(context, `Country`);
            const authorFields = authorDef.config.fields;
            const countryFields = countryDef.config
                .fields;
            expect(Object.keys(authorFields !== null && authorFields !== void 0 ? authorFields : {})).toHaveLength(4);
            expect(authorFields).toMatchObject({
                id: { type: `ID!` },
                displayName: { type: `String!` },
                country: { type: `TestApiCountry` },
                posts: { type: `[TestApiPost!]!` },
            });
            expect(Object.keys(countryFields !== null && countryFields !== void 0 ? countryFields : {})).toHaveLength(1);
            expect(countryFields).toMatchObject({
                displayName: { type: `String!` },
            });
        });
        it(`adds fields to node type referenced in other node type queries`, () => {
            // FIXME: we shouldn't add fields from other node type queries as
            //  they won't always resolve correctly?
            const gatsbyNodeDefs = (0, test_utils_1.createGatsbyNodeDefinitions)([
                {
                    remoteTypeName: `Author`,
                    queries: `{ authors { id } }`,
                },
                {
                    remoteTypeName: `Post`,
                    queries: `{ posts { author { displayName } } }`,
                },
            ]);
            const context = (0, blog_schema_1.createTestContext)({ gatsbyNodeDefs });
            const authorDef = (0, build_types_1.buildTypeDefinition)(context, `Author`);
            const authorFields = authorDef.config.fields;
            expect(Object.keys(authorFields !== null && authorFields !== void 0 ? authorFields : {})).toHaveLength(2);
            expect(authorFields).toMatchObject({
                id: { type: `ID!` },
                displayName: { type: `String!` },
            });
        });
    });
});
//# sourceMappingURL=build-types.test.js.map