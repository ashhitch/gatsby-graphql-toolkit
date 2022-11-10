import { IGatsbyNodeConfig, IGatsbyNodeDefinition, RemoteTypeName } from "../../types";
export declare function createGatsbyNodeDefinitions(defs: Array<Partial<IGatsbyNodeConfig>>): Map<RemoteTypeName, IGatsbyNodeDefinition>;
