"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const test_utils_1 = require("../test-utils");
const __1 = require("../..");
// See https://github.com/vladar/gatsby-graphql-toolkit/issues/13
const schema = (0, graphql_1.buildSchema)(`
  type Foo {
    id: ID!
    foo: String
  }
  input FooInput {
    id: ID
    limit: Int
    offset: Int
  }
  type Query {
    foo(input: FooInput): Foo
    allFoo(input: FooInput): [Foo]
  }
`);
const gatsbyNodeTypes = [
    {
        remoteTypeName: `Foo`,
        queries: `
      query LIST_FOO {
        allFoo(input: { limit: $limit offset: $offset }) { ..._FooId_ }
      }
      query NODE_FOO {
        foo(input: { id: $id }) { ..._FooId_ }
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
it(`adds variable declarations for variables within input objects`, async () => {
    expect((0, test_utils_1.printQuery)(documents, `Foo`)).toEqual((0, test_utils_1.dedent) `
    query LIST_FOO ($limit: Int $offset: Int) {
      allFoo(input: { limit: $limit, offset: $offset }) {
        remoteTypeName: __typename
        ..._FooId_
      }
    }

    query NODE_FOO ($id: ID) {
      foo(input: {id: $id}) {
        remoteTypeName: __typename
        ..._FooId_
      }
    }

    fragment _FooId_ on Foo {
      remoteTypeName: __typename
      remoteId: id
    }
  `);
});
it(`correctly detects field to paginate in list query`, async () => {
    const context = (0, __1.createSourcingContext)({
        schema,
        gatsbyNodeDefs: (0, __1.buildNodeDefinitions)({ gatsbyNodeTypes, documents }),
        execute: async () => Promise.resolve({ data: { allFoo: [fooNode] } }),
        gatsbyApi: test_utils_1.gatsbyApi,
        gatsbyTypePrefix: `Test`,
        paginationAdapters: [__1.LimitOffset],
    });
    const fetchNodes = async () => {
        const nodes = [];
        for await (const node of (0, __1.fetchNodeList)(context, `Foo`, `LIST_FOO`)) {
            nodes.push(node);
        }
        return nodes;
    };
    // Without the fix it throws:
    // Cannot find field to paginate in the query LIST_FOO. Make sure you spread IDFragment in your source query:
    //  query LIST_FOO { field { ...IDFragment } }
    await expect(fetchNodes()).resolves.toEqual([fooNode]);
});
it(`correctly detects node field in node query`, async () => {
    const context = (0, __1.createSourcingContext)({
        schema,
        gatsbyNodeDefs: (0, __1.buildNodeDefinitions)({ gatsbyNodeTypes, documents }),
        execute: async () => Promise.resolve({ data: { foo: fooNode } }),
        gatsbyApi: test_utils_1.gatsbyApi,
        gatsbyTypePrefix: `Test`,
        paginationAdapters: [__1.LimitOffset],
    });
    // Without the fix it throws:
    //   Value of the ID field "remoteTypeName" can't be nullish. Got object with keys: foo
    const fooId = {
        remoteTypeName: fooNode.remoteTypeName,
        remoteId: fooNode.remoteId,
    };
    await expect((0, __1.fetchNodeById)(context, `Foo`, fooId)).resolves.toEqual(fooNode);
});
//# sourceMappingURL=issue-13.test.js.map