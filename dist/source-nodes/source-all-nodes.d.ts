import { ISourcingConfig } from "../types";
/**
 * Uses sourcing config to fetch all data from the remote GraphQL API
 * and create gatsby nodes (using Gatsby `createNode` action)
 */
export declare function sourceAllNodes(config: ISourcingConfig): Promise<void>;
