"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const test_utils_1 = require("../test-utils");
const __1 = require("../..");
// See https://github.com/vladar/gatsby-graphql-toolkit/issues/14
const schema = (0, graphql_1.buildSchema)(`
  type Foo {
    id: ID!
    foo: String
  }
  input FooInput {
    id: ID
  }
  type Query {
    allFoo(input: FooInput): [Foo]
  }
`);
const gatsbyNodeTypes = [
    {
        remoteTypeName: `Foo`,
        queries: `
      query NODE_FOO {
        allFoo(input: { id: $id }) { ..._FooId_ }
      }
      fragment _FooId_ on Foo { __typename id }
    `,
    },
];
const documents = (0, __1.compileNodeQueries)({
    schema,
    gatsbyNodeTypes,
    customFragments: [],
});
const fooNode = {
    remoteTypeName: `Foo`,
    remoteId: `1`,
    foo: `fooString`,
};
it(`supports lists with a single item in a node query`, async () => {
    const context = (0, __1.createSourcingContext)({
        schema,
        gatsbyNodeDefs: (0, __1.buildNodeDefinitions)({ gatsbyNodeTypes, documents }),
        execute: async () => Promise.resolve({ data: { allFoo: [fooNode] } }),
        gatsbyApi: test_utils_1.gatsbyApi,
        gatsbyTypePrefix: `Test`,
    });
    const fooId = {
        remoteTypeName: fooNode.remoteTypeName,
        remoteId: fooNode.remoteId,
    };
    // Without the fix it throws:
    //   Error: Value of the ID field "remoteTypeName" can't be nullish. Got object with keys: 0
    await expect((0, __1.fetchNodeById)(context, `Foo`, fooId)).resolves.toEqual(fooNode);
});
//# sourceMappingURL=issue-14.test.js.map