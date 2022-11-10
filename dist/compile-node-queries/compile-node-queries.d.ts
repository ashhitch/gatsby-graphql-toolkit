import { DocumentNode, GraphQLSchema } from "graphql";
import { GraphQLSource, IGatsbyFieldAliases, IGatsbyNodeConfig, RemoteTypeName } from "../types";
interface ICompileNodeQueriesArgs {
    schema: GraphQLSchema;
    gatsbyNodeTypes: IGatsbyNodeConfig[];
    gatsbyFieldAliases?: IGatsbyFieldAliases;
    customFragments: Array<GraphQLSource | string> | Map<RemoteTypeName, GraphQLSource | string>;
}
/**
 * Combines `queries` from node types config with any user-defined
 * fragments and produces final queries used for node sourcing.
 */
export declare function compileNodeQueries(args: ICompileNodeQueriesArgs): Map<RemoteTypeName, DocumentNode>;
export {};
