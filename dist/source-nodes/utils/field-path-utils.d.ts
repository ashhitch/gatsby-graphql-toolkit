import { DocumentNode, FieldNode } from "graphql";
import { IPaginationAdapter } from "../../config/pagination-adapters";
/**
 * Given a query and an effective pagination adapter - returns field path to the first
 * paginated field
 *
 * E.g.
 *   { field { paginatedField(limit: $limit, offset: $offset) { test } } }
 * or
 *   { field { ...MyFragment }}
 *   fragment MyFragment on MyType {
 *     paginatedField(limit: $limit, offset: $offset) { test }
 *   }
 * both return
 *   ["field", "paginatedField"]
 */
export declare function findPaginatedFieldPath(document: DocumentNode, operationName: string, paginationAdapter: IPaginationAdapter<any, any>): string[];
/**
 * Given a query and a remote node type returns a path to the node field within the query
 */
export declare function findNodeFieldPath(document: DocumentNode, operationName: string): string[];
export declare function findFieldPath(document: DocumentNode, operationName: string, predicate: (field: FieldNode) => boolean): string[];
export declare function getFirstValueByPath(item: unknown, path: string[]): unknown;
export declare function updateFirstValueByPath(item: object | object[], path: string[], newValue: unknown): any;
