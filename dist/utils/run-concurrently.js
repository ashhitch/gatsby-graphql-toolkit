"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runConcurrently = void 0;
const lodash_1 = require("lodash");
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
async function* runConcurrently(thunks, concurrency) {
    // TODO: start the next task as soon as the previous ends vs running in chunks?
    //   also consider binding this with query batching
    const taskChunks = (0, lodash_1.chunk)(thunks, concurrency);
    for (const taskChunk of taskChunks) {
        const results = await Promise.all(taskChunk.map(task => task()));
        for (const taskResult of results) {
            yield taskResult;
        }
    }
}
exports.runConcurrently = runConcurrently;
//# sourceMappingURL=run-concurrently.js.map