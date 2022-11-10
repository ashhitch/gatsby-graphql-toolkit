"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultQueryExecutor = exports.wrapQueryExecutorWithQueue = exports.createNetworkQueryExecutor = void 0;
const util_1 = require("util");
const p_queue_1 = __importDefault(require("p-queue"));
const node_fetch_1 = __importDefault(require("node-fetch"));
function createNetworkQueryExecutor(uri, fetchOptions = {}) {
    return async function execute(args) {
        var _a;
        const { query, variables, operationName } = args;
        const response = await (0, node_fetch_1.default)(uri, {
            method: "POST",
            body: JSON.stringify({ query, variables, operationName }),
            ...fetchOptions,
            headers: {
                "Content-Type": "application/json",
                ...fetchOptions.headers,
            },
        });
        if (!response.ok) {
            console.warn(`Query ${operationName} returned status ${response.status}.\n` +
                `Query variables: ${(0, util_1.inspect)(variables)}`);
        }
        const result = (await response.json());
        if (result.data && ((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length)) {
            console.warn(`Query ${operationName} returned warnings:\n` +
                `${(0, util_1.inspect)(result.errors)}\n` +
                `Query variables: ${(0, util_1.inspect)(variables)}`);
        }
        return result;
    };
}
exports.createNetworkQueryExecutor = createNetworkQueryExecutor;
/**
 * Takes existing query `executor` function and creates a new
 * function with the same signature that runs with given
 * concurrency level (`10` by default).
 *
 * See p-queue library docs for all available `queueOptions`
 */
function wrapQueryExecutorWithQueue(executor, queueOptions = { concurrency: 10 }) {
    const queryQueue = new p_queue_1.default(queueOptions);
    return async function executeQueued(args) {
        return await queryQueue.add(() => executor(args));
    };
}
exports.wrapQueryExecutorWithQueue = wrapQueryExecutorWithQueue;
/**
 * Creates default query executor suitable for sourcing config
 */
function createDefaultQueryExecutor(uri, fetchOptions, queueOptions = { concurrency: 10 }) {
    const executor = createNetworkQueryExecutor(uri, fetchOptions);
    return wrapQueryExecutorWithQueue(executor, queueOptions);
}
exports.createDefaultQueryExecutor = createDefaultQueryExecutor;
//# sourceMappingURL=query-executor.js.map