export declare type AsyncThunk<T> = () => Promise<T>;
/**
 * Async generator that executes thunks with defined concurrency.
 *
 * Example:
 * ```
 * const thunks = [
 *   () => promise1,
 *   () => promise2,
 *   () => promise3,
 * ]
 *
 * for await (const result of runConcurrently(thunks, 2)) {
 *   console.log(result)
 * }
 * ```
 * This code will NOT call `() => promise3` until the first two promises
 * are resolved and yielded
 */
export declare function runConcurrently<T>(thunks: AsyncThunk<T>[], concurrency: number): AsyncIterable<T>;
