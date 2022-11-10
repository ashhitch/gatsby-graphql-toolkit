import { ISourcingContext, IRemoteNode } from "../../types";
/**
 * Fetches and paginates remote nodes by type while reporting progress
 */
export declare function fetchAllNodes(context: ISourcingContext, remoteTypeName: string, variables?: object): AsyncIterable<IRemoteNode>;
export declare function fetchNodeList(context: ISourcingContext, remoteTypeName: string, listOperationName: string, variables?: object): AsyncIterable<IRemoteNode>;
