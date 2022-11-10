import { IRemoteId, IRemoteNode, ISourcingContext } from "../../types";
export declare function fetchNonNullishNodesById(context: ISourcingContext, remoteTypeName: string, ids: IRemoteId[]): AsyncIterable<IRemoteNode>;
export declare function fetchNodesById(context: ISourcingContext, remoteTypeName: string, ids: IRemoteId[]): AsyncIterable<IRemoteNode | void>;
export declare function fetchNodeById(context: ISourcingContext, remoteTypeName: string, id: IRemoteId): Promise<IRemoteNode | void>;
