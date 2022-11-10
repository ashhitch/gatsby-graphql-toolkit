import { FieldNode, FragmentDefinitionNode, GraphQLSchema } from "graphql";
import { IGatsbyNodeConfig, RemoteTypeName } from "../../types";
declare type TypeUsagePath = string;
declare type TypeUsages = Map<TypeUsagePath, FieldNode[]>;
export declare type TypeUsagesMap = Map<RemoteTypeName, TypeUsages>;
interface IBuildTypeUsagesMapArgs {
    schema: GraphQLSchema;
    gatsbyNodeTypes: IGatsbyNodeConfig[];
    fragments: FragmentDefinitionNode[];
}
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
export declare function buildTypeUsagesMap(args: IBuildTypeUsagesMapArgs): TypeUsagesMap;
export {};
