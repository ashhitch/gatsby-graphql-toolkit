"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const test_utils_1 = require("../test-utils");
const compile_node_queries_1 = require("../../compile-node-queries");
// See https://github.com/vladar/gatsby-graphql-toolkit/issues/5
const schema = (0, graphql_1.buildSchema)(`
  type Foo {
    id: ID!
    foo: String
  }
  type Query {
    nodes: Foo
  }
`);
const gatsbyNodeTypes = [
    {
        remoteTypeName: `Foo`,
        queries: `
      fragment FooId on Foo { __typename id }
      query LIST_Foo {
        nodes { ...FooId }
      }
    `,
    },
];
it(`should spread fragments correctly when ID fragment is defined before the query`, async () => {
    const documents = await (0, compile_node_queries_1.compileNodeQueries)({
        schema,
        gatsbyNodeTypes,
        customFragments: [`fragment Foo on Foo { foo }`],
    });
    expect((0, test_utils_1.printQuery)(documents, `Foo`)).toEqual((0, test_utils_1.dedent) `
    query LIST_Foo {
      nodes {
        remoteTypeName: __typename
        ...FooId
        ...Foo
      }
    }
    fragment FooId on Foo {
      remoteTypeName: __typename
      remoteId: id
    }
    fragment Foo on Foo {
      foo
    }
  `);
});
//# sourceMappingURL=issue-5.test.js.map