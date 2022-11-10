"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestContext = exports.createBlogSchema = void 0;
const graphql_1 = require("graphql");
const fs_1 = require("fs");
const create_schema_customization_1 = require("../../create-schema-customization");
const test_utils_1 = require("../../../__tests__/test-utils");
function createBlogSchema() {
    const source = (0, fs_1.readFileSync)(__dirname + "/../fixtures/schema-blog.graphql");
    return (0, graphql_1.buildSchema)(source.toString());
}
exports.createBlogSchema = createBlogSchema;
function createTestContext(config = {}) {
    return (0, create_schema_customization_1.createSchemaCustomizationContext)({
        schema: createBlogSchema(),
        gatsbyApi: test_utils_1.gatsbyApi,
        gatsbyTypePrefix: `TestApi`,
        execute() {
            throw new Error("Should not execute");
        },
        gatsbyNodeDefs: new Map(),
        ...config,
    });
}
exports.createTestContext = createTestContext;
//# sourceMappingURL=blog-schema.js.map