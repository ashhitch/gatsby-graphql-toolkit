import { IntrospectionQuery, GraphQLSchema } from "graphql";
import { IQueryExecutor } from "../types";
export declare function introspectSchema(execute: IQueryExecutor): Promise<IntrospectionQuery>;
/**
 * Executes GraphQL introspection query using provided query executor
 * and creates an instance of GraphQL Schema using `buildClientSchema`
 * utility from `graphql-js` package.
 */
export declare function loadSchema(execute: IQueryExecutor): Promise<GraphQLSchema>;
