import { DocumentNode } from "graphql";
import { IGatsbyNodeDefinition, RemoteTypeName, IGatsbyNodeConfig } from "../types";
interface IBuildNodeDefinitionArgs {
    gatsbyNodeTypes: IGatsbyNodeConfig[];
    documents: Map<RemoteTypeName, DocumentNode>;
}
/**
 * Simple utility that merges user-defined node type configs with compiled
 * queries for every node type, and produces a value suitable for
 * `gatsbyNodeDefs` option of sourcing config.
 */
export declare function buildNodeDefinitions({ gatsbyNodeTypes, documents, }: IBuildNodeDefinitionArgs): Map<RemoteTypeName, IGatsbyNodeDefinition>;
export {};
