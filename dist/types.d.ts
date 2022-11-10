import { Node, NodePluginArgs } from "gatsby";
import { ObjectTypeComposerFieldConfigDefinition } from "graphql-compose";
import { DocumentNode, ExecutionResult, GraphQLSchema, GraphQLField, GraphQLType, FragmentDefinitionNode, Source } from "graphql";
import { IPaginationAdapter } from "./config/pagination-adapters";
import { TypeUsagesMap } from "./compile-node-queries/analyze/build-type-usages-map";
export declare type RemoteTypeName = string;
export declare type RemoteFieldAlias = string;
export interface IGatsbyFieldAliases {
    [field: string]: RemoteFieldAlias;
}
export declare type FragmentMap = Map<RemoteTypeName, FragmentDefinitionNode>;
export interface IQueryExecutionArgs {
    query: string;
    operationName: string;
    variables: object;
    document?: DocumentNode;
}
export interface IQueryExecutor {
    (args: IQueryExecutionArgs): Promise<ExecutionResult>;
}
export interface ISourcingConfig {
    gatsbyApi: NodePluginArgs;
    schema: GraphQLSchema;
    gatsbyNodeDefs: Map<RemoteTypeName, IGatsbyNodeDefinition>;
    gatsbyTypePrefix: string;
    execute: IQueryExecutor;
    gatsbyFieldAliases?: IGatsbyFieldAliases;
    idTransform?: INodeIdTransform;
    typeNameTransform?: ITypeNameTransform;
    paginationAdapters?: IPaginationAdapter<any, any>[];
}
export declare type GraphQLSource = string | Source;
export interface IGatsbyNodeConfig {
    remoteTypeName: RemoteTypeName;
    queries: GraphQLSource;
    nodeQueryVariables?: (id: IRemoteId) => object;
}
export interface IRemoteNode {
    [key: string]: unknown;
}
export interface IObject {
    [field: string]: unknown;
}
export interface IRemoteId {
    [remoteIdField: string]: unknown;
}
export interface IFetchResult {
    remoteTypeName: string;
    allNodes: AsyncIterable<IRemoteNode>;
}
export interface INodeUpdateEvent {
    eventName: "UPDATE";
    remoteTypeName: RemoteTypeName;
    remoteId: IRemoteId;
}
export interface INodeDeleteEvent {
    eventName: "DELETE";
    remoteTypeName: RemoteTypeName;
    remoteId: IRemoteId;
}
export declare type NodeEvent = INodeUpdateEvent | INodeDeleteEvent;
export interface ISourceChanges {
    nodeEvents: NodeEvent[];
}
export interface INodeIdTransform {
    remoteNodeToGatsbyId: (remoteNode: IRemoteNode, def: IGatsbyNodeDefinition) => string;
    remoteNodeToId: (remoteNode: IRemoteNode, def: IGatsbyNodeDefinition) => IRemoteId;
    gatsbyNodeToRemoteId: (gatsbyNode: Node, def: IGatsbyNodeDefinition) => IRemoteId;
    remoteIdToGatsbyNodeId: (remoteId: IRemoteId, def: IGatsbyNodeDefinition) => string;
}
export interface ITypeNameTransform {
    toGatsbyTypeName: (remoteTypeName: string) => string;
    toRemoteTypeName: (gatsbyTypeName: string) => string;
}
/**
 * Structure containing all the information required to fetch node and build schema customization for it
 */
export interface IGatsbyNodeDefinition {
    remoteTypeName: RemoteTypeName;
    document: DocumentNode;
    nodeQueryVariables: (id: IRemoteId) => object;
}
export interface ISourcingContext extends ISourcingConfig {
    idTransform: INodeIdTransform;
    gatsbyFieldAliases: IGatsbyFieldAliases;
    typeNameTransform: ITypeNameTransform;
    paginationAdapters: IPaginationAdapter<any, any>[];
    formatLogMessage: (message: string) => string;
}
export interface ISchemaCustomizationContext extends ISourcingConfig {
    sourcingPlan: ISourcingPlan;
    gatsbyFieldAliases: IGatsbyFieldAliases;
    idTransform: INodeIdTransform;
    typeNameTransform: ITypeNameTransform;
}
export interface ICompileQueriesContext {
    schema: GraphQLSchema;
    gatsbyNodeTypes: Map<RemoteTypeName, IGatsbyNodeConfig>;
    typeUsagesMap: TypeUsagesMap;
    nodeReferenceFragmentMap: FragmentMap;
    originalConfigQueries: Map<RemoteTypeName, DocumentNode>;
    originalCustomFragments: FragmentDefinitionNode[];
    gatsbyFieldAliases: IGatsbyFieldAliases;
}
export interface IRemoteFieldUsage {
    name: string;
    alias: string;
}
/**
 * Contains metadata after analyzing all of the node queries
 */
export interface ISourcingPlan {
    fetchedTypeMap: Map<RemoteTypeName, Map<RemoteFieldAlias, IRemoteFieldUsage>>;
    remoteNodeTypes: Set<RemoteTypeName>;
}
export interface IGatsbyFieldInfo {
    gatsbyFieldName: string;
    remoteFieldName: string;
    remoteFieldAlias: string;
    remoteParentType: string;
    gatsbyParentType: string;
}
interface IGatsbyFieldTransformArgs {
    remoteField: GraphQLField<any, any>;
    remoteParentType: GraphQLType;
    fieldInfo: IGatsbyFieldInfo;
    context: ISchemaCustomizationContext;
}
export interface IGatsbyFieldTransform {
    test: (args: IGatsbyFieldTransformArgs) => boolean;
    transform: (args: IGatsbyFieldTransformArgs) => ObjectTypeComposerFieldConfigDefinition<any, any>;
}
export {};
