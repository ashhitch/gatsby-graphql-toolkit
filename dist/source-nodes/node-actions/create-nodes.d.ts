import { ISourcingContext, IRemoteNode } from "../../types";
export declare function createNodes(context: ISourcingContext, remoteTypeName: string, remoteNodes: AsyncIterable<IRemoteNode>): Promise<void>;
declare type GatsbyNodeId = string;
export declare function createNode(context: ISourcingContext, remoteNode: IRemoteNode): Promise<GatsbyNodeId>;
export {};
