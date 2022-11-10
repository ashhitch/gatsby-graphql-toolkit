import { TypeInfo, GraphQLSchema, FragmentDefinitionNode, ASTVisitor } from "graphql";
import { FragmentMap } from "../../types";
interface ITransformArgs {
    schema: GraphQLSchema;
    typeInfo: TypeInfo;
    originalCustomFragments: FragmentDefinitionNode[];
    nodeReferenceFragmentMap: FragmentMap;
}
/**
 * Replaces selection of nodes with references to those nodes.
 *
 * For example (assuming `author` is of type `User` which is a gatsby node):
 * {
 *   author {
 *     firstName
 *     email
 *   }
 * }
 * Is transformed to:
 * {
 *   author {
 *     __typename
 *     id
 *   }
 * }
 */
export declare function replaceNodeSelectionWithReference(args: ITransformArgs): ASTVisitor;
export {};
