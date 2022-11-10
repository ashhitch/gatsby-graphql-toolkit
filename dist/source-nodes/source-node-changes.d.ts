import { ISourceChanges, ISourcingConfig } from "../types";
/**
 * Uses sourcing config and a list of node change events (delta) to
 * delete nodes that no longer exist in the remote API and re-fetch
 * individual nodes that were updated in the remote API
 * since the last Gatsby build.
 */
export declare function sourceNodeChanges(config: ISourcingConfig, delta: ISourceChanges): Promise<void>;
