import { IGatsbyNodeDefinition, ISourcingContext } from "../../types";
export declare function touchNodes(context: ISourcingContext, excludeIds?: Set<string>): void;
export declare function touchNodesByType(context: ISourcingContext, def: IGatsbyNodeDefinition, excludeIds?: Set<string>): void;
