"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const test_utils_1 = require("../test-utils");
const compile_node_queries_1 = require("../../compile-node-queries");
// See https://github.com/vladar/gatsby-graphql-toolkit/issues/11
const schema = (0, graphql_1.buildSchema)(`
  type Sys {
    id: ID!
  }
  type Foo {
    sys: Sys
    foo: String
    bar: [Bar]
  }
  type Bar {
    sys: Sys
    bar: String
  }
  type Query {
    fooNodes: [Foo]
    barNodes: [Bar]
  }
`);
const gatsbyNodeTypes = [
    {
        remoteTypeName: `Foo`,
        queries: `
      query LIST_Foo {
        fooNodes { ...FooId }
      }
      fragment FooId on Foo { __typename sys { id } }
    `,
    },
    {
        remoteTypeName: `Bar`,
        queries: `
      query LIST_Bar {
        barNodes { ...BarId }
      }
      fragment BarId on Bar { __typename sys { id } }
    `,
    },
];
it(`should remove redundant fragments`, async () => {
    const documents = await (0, compile_node_queries_1.compileNodeQueries)({
        schema,
        gatsbyNodeTypes,
        customFragments: [
            `fragment Foo on Foo {
        foo
        bar {
          sys {
            id
          }
        }
        otherBar: bar {
          remoteTypeName: __typename
          sys {
            id
          }
        }
      }`,
        ],
    });
    expect((0, test_utils_1.printQuery)(documents, `Bar`)).toEqual((0, test_utils_1.dedent) `
    query LIST_Bar {
      barNodes {
        remoteTypeName: __typename
        ...BarId
      }
    }

    fragment BarId on Bar {
      remoteTypeName: __typename
      sys {
        id
      }
    }

    # This fragment is removed from the result:
    # fragment Foo__bar on Bar {
    #   sys {
    #     remoteTypeName: __typename
    #     id
    #   }
    # }
    # fragment Foo__otherBar on Bar {
    #   remoteTypeName: __typename
    #   sys {
    #     remoteTypeName: __typename
    #     id
    #   }
    # }
  `);
});
//# sourceMappingURL=issue-11.test.js.map