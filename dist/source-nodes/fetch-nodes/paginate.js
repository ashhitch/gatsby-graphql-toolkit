"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findQueryDefinitionNode = exports.resolvePaginationAdapter = exports.planPagination = exports.combinePages = exports.paginate = void 0;
const graphql_1 = require("graphql");
const pagination_adapters_1 = require("../../config/pagination-adapters");
const field_path_utils_1 = require("../utils/field-path-utils");
const constants_1 = require("../../constants");
const util_1 = require("util");
const ast_predicates_1 = require("../../utils/ast-predicates");
async function* paginate(context, plan) {
    var _a;
    const query = (0, graphql_1.print)(plan.document);
    let pageInfo = plan.adapter.start();
    let currentPage = 0;
    while (pageInfo.hasNextPage) {
        const variables = { ...plan.variables, ...pageInfo.variables };
        const result = await context.execute({
            query,
            document: plan.document,
            operationName: plan.operationName,
            variables,
        });
        if (!result.data) {
            let message = `Failed to execute query ${plan.operationName}.\n`;
            if ((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length) {
                message += `Errors:\n`;
                message += result.errors.map(err => err.message).join(`\n\n`);
            }
            throw new Error(message);
        }
        if (currentPage++ > constants_1.MAX_QUERY_PAGES) {
            // TODO: make MAX_QUERY_PAGES configurable?
            throw new Error(`Query ${plan.operationName} exceeded allowed maximum number of pages: ${currentPage}\n` +
                `  Pagination: ${plan.adapter.name}\n` +
                `  Last variables: ${(0, util_1.inspect)(variables)}`);
        }
        const page = (0, field_path_utils_1.getFirstValueByPath)(result.data, plan.fieldPath);
        pageInfo = plan.adapter.next(pageInfo, page);
        yield { result, fieldValue: page, variables };
    }
}
exports.paginate = paginate;
async function combinePages(pages, plan) {
    let result;
    let combinedFieldValue;
    for await (const page of pages) {
        combinedFieldValue = combinedFieldValue
            ? plan.adapter.concat(combinedFieldValue, page.fieldValue)
            : page.fieldValue;
        result = page.result;
    }
    if (!result || !result.data) {
        return undefined;
    }
    (0, field_path_utils_1.updateFirstValueByPath)(result.data, plan.fieldPath, combinedFieldValue);
    return result;
}
exports.combinePages = combinePages;
function planPagination(context, document, operationName, variables = {}) {
    const adapter = resolvePaginationAdapter(document, operationName, variables, context.paginationAdapters);
    const fieldPath = (0, field_path_utils_1.findPaginatedFieldPath)(document, operationName, adapter);
    const fieldName = fieldPath[fieldPath.length - 1];
    if (!fieldName) {
        throw new Error(`Cannot find field to paginate in the query ${operationName}. ` +
            `Make sure you spread IDFragment in your source query:\n` +
            ` query ${operationName} { field { ...IDFragment } }`);
    }
    return {
        document,
        operationName,
        variables,
        adapter,
        fieldName,
        fieldPath,
    };
}
exports.planPagination = planPagination;
function resolvePaginationAdapter(document, operationName, customVariables = {}, paginationAdapters = pagination_adapters_1.PaginationAdapters) {
    var _a, _b;
    const queryNode = findQueryDefinitionNode(document, operationName);
    // All variable names, including pagination variables and custom query variables
    const variableNames = (_b = (_a = queryNode.variableDefinitions) === null || _a === void 0 ? void 0 : _a.map(variable => variable.variable.name.value)) !== null && _b !== void 0 ? _b : [];
    const customVariableNames = Object.keys(customVariables);
    const restVariableNames = variableNames.filter(name => !customVariableNames.includes(name));
    const restVariableSet = new Set(restVariableNames);
    const adapter = paginationAdapters.find(s => s.expectedVariableNames.length === restVariableNames.length &&
        s.expectedVariableNames.every(name => restVariableSet.has(name)));
    if (!adapter) {
        throw new Error(`Could not resolve pagination adapter for the query ${operationName}`);
    }
    return adapter;
}
exports.resolvePaginationAdapter = resolvePaginationAdapter;
function findQueryDefinitionNode(document, operationName) {
    var _a;
    const operations = document.definitions.filter(ast_predicates_1.isOperation);
    const queryNode = operations.find(op => { var _a; return ((_a = op.name) === null || _a === void 0 ? void 0 : _a.value) === operationName; });
    if (!queryNode) {
        const documentName = (_a = document.loc) === null || _a === void 0 ? void 0 : _a.source.name;
        if (documentName) {
            throw new Error(`Query ${operationName} not found in the ${documentName}.`);
        }
        else {
            const otherQueries = operations
                .map(op => { var _a, _b; return (_b = (_a = op.name) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : `UnnamedQuery`; })
                .join(`,`);
            throw new Error(`Query ${operationName} not found in the GraphQL document. ` +
                `Queries found in this document: ${otherQueries}`);
        }
    }
    return queryNode;
}
exports.findQueryDefinitionNode = findQueryDefinitionNode;
//# sourceMappingURL=paginate.js.map