import { Options as PQueueOptions } from "p-queue";
import { RequestInit as FetchOptions } from "node-fetch";
import { IQueryExecutor } from "../types";
export declare function createNetworkQueryExecutor(uri: string, fetchOptions?: FetchOptions): IQueryExecutor;
/**
 * Takes existing query `executor` function and creates a new
 * function with the same signature that runs with given
 * concurrency level (`10` by default).
 *
 * See p-queue library docs for all available `queueOptions`
 */
export declare function wrapQueryExecutorWithQueue(executor: IQueryExecutor, queueOptions?: PQueueOptions<any, any>): IQueryExecutor;
/**
 * Creates default query executor suitable for sourcing config
 */
export declare function createDefaultQueryExecutor(uri: string, fetchOptions: FetchOptions, queueOptions?: PQueueOptions<any, any>): IQueryExecutor;
