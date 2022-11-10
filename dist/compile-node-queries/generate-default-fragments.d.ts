import { GraphQLSchema, GraphQLField, GraphQLObjectType, FragmentDefinitionNode } from "graphql";
import { IGatsbyNodeConfig, IGatsbyFieldAliases, RemoteTypeName } from "../types";
export interface IArgumentValueResolver {
    (field: GraphQLField<any, any>, parentType: GraphQLObjectType): void | {
        [argName: string]: unknown;
    };
}
export interface IDefaultFragmentsConfig {
    schema: GraphQLSchema;
    gatsbyNodeTypes: IGatsbyNodeConfig[];
    gatsbyFieldAliases?: IGatsbyFieldAliases;
    defaultArgumentValues?: IArgumentValueResolver[];
}
/**
 * Utility function that generates default fragments for every gatsby node type
 */
export declare function generateDefaultFragments(config: IDefaultFragmentsConfig): Map<RemoteTypeName, string>;
export declare function generateDefaultFragmentNodes(config: IDefaultFragmentsConfig): Map<RemoteTypeName, FragmentDefinitionNode>;
