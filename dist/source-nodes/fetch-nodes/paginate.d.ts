import { DocumentNode, ExecutionResult, OperationDefinitionNode } from "graphql";
import { ISourcingContext } from "../../types";
import { IPaginationAdapter } from "../../config/pagination-adapters";
interface IPaginationPlan {
    document: DocumentNode;
    operationName: string;
    variables: object;
    fieldPath: string[];
    fieldName: string;
    adapter: IPaginationAdapter<any, any>;
}
interface IPage {
    result: ExecutionResult;
    fieldValue: unknown;
    variables: object;
}
export declare function paginate(context: ISourcingContext, plan: IPaginationPlan): AsyncIterable<IPage>;
export declare function combinePages(pages: AsyncIterable<IPage>, plan: IPaginationPlan): Promise<ExecutionResult | void>;
export declare function planPagination(context: ISourcingContext, document: DocumentNode, operationName: string, variables?: object): IPaginationPlan;
export declare function resolvePaginationAdapter(document: DocumentNode, operationName: string, customVariables?: object, paginationAdapters?: IPaginationAdapter<any, any>[]): IPaginationAdapter<any, any>;
export declare function findQueryDefinitionNode(document: DocumentNode, operationName: string): OperationDefinitionNode;
export {};
