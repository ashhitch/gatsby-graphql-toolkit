import { DocumentNode } from "graphql";
import { IGatsbyNodeDefinition, ISourcingContext } from "../../types";
export declare function collectListOperationNames(doc: DocumentNode): string[];
export declare function collectNodeOperationNames(doc: DocumentNode): string[];
export declare function collectNodeFieldOperationNames(doc: DocumentNode): string[];
export declare function findNodeOperationName(def: IGatsbyNodeDefinition): string;
export declare function getGatsbyNodeDefinition(context: ISourcingContext, remoteTypeName: string): IGatsbyNodeDefinition;
