"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemaCustomizationContext = exports.createSchemaCustomization = void 0;
const build_types_1 = require("./build-types");
const build_sourcing_plan_1 = require("./analyze/build-sourcing-plan");
const node_id_transform_1 = require("../config/node-id-transform");
const type_name_transform_1 = require("../config/type-name-transform");
const default_gatsby_field_aliases_1 = require("../config/default-gatsby-field-aliases");
/**
 * Uses sourcing config to define Gatsby types explicitly
 * (using Gatsby schema customization API).
 */
async function createSchemaCustomization(config) {
    const context = createSchemaCustomizationContext(config);
    const typeDefs = (0, build_types_1.buildTypeDefinitions)(context);
    context.gatsbyApi.actions.createTypes(typeDefs);
}
exports.createSchemaCustomization = createSchemaCustomization;
function createSchemaCustomizationContext(config) {
    var _a;
    const gatsbyFieldAliases = (_a = config.gatsbyFieldAliases) !== null && _a !== void 0 ? _a : default_gatsby_field_aliases_1.defaultGatsbyFieldAliases;
    const { idTransform = (0, node_id_transform_1.createNodeIdTransform)(), typeNameTransform = (0, type_name_transform_1.createTypeNameTransform)({
        gatsbyTypePrefix: config.gatsbyTypePrefix,
        gatsbyNodeTypeNames: Array.from(config.gatsbyNodeDefs.keys()),
    }), } = config;
    return {
        ...config,
        gatsbyFieldAliases,
        idTransform,
        typeNameTransform,
        sourcingPlan: (0, build_sourcing_plan_1.buildSourcingPlan)(config),
    };
}
exports.createSchemaCustomizationContext = createSchemaCustomizationContext;
//# sourceMappingURL=create-schema-customization.js.map