"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSchema = exports.introspectSchema = void 0;
const graphql_1 = require("graphql");
async function introspectSchema(execute) {
    var _a, _b;
    const introspectionResult = await execute({
        query: (0, graphql_1.getIntrospectionQuery)(),
        operationName: `IntrospectionQuery`,
        variables: {},
    });
    if (!introspectionResult.data || ((_a = introspectionResult.errors) === null || _a === void 0 ? void 0 : _a.length)) {
        const error = ((_b = introspectionResult.errors) === null || _b === void 0 ? void 0 : _b.length)
            ? introspectionResult.errors[0].message
            : ``;
        throw new Error(`Schema introspection failed. First error: ${error}`);
    }
    return introspectionResult.data;
}
exports.introspectSchema = introspectSchema;
/**
 * Executes GraphQL introspection query using provided query executor
 * and creates an instance of GraphQL Schema using `buildClientSchema`
 * utility from `graphql-js` package.
 */
async function loadSchema(execute) {
    const introspectionResult = await introspectSchema(execute);
    return (0, graphql_1.buildClientSchema)(introspectionResult);
}
exports.loadSchema = loadSchema;
//# sourceMappingURL=load-schema.js.map