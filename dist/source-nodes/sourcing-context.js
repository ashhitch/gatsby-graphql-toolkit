"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSourcingContext = void 0;
const default_gatsby_field_aliases_1 = require("../config/default-gatsby-field-aliases");
const node_id_transform_1 = require("../config/node-id-transform");
const type_name_transform_1 = require("../config/type-name-transform");
const format_log_message_1 = require("../utils/format-log-message");
const pagination_adapters_1 = require("../config/pagination-adapters");
function createSourcingContext(config) {
    var _a;
    const gatsbyFieldAliases = (_a = config.gatsbyFieldAliases) !== null && _a !== void 0 ? _a : default_gatsby_field_aliases_1.defaultGatsbyFieldAliases;
    const { idTransform = (0, node_id_transform_1.createNodeIdTransform)(), typeNameTransform = (0, type_name_transform_1.createTypeNameTransform)({
        gatsbyTypePrefix: config.gatsbyTypePrefix,
        gatsbyNodeTypeNames: Array.from(config.gatsbyNodeDefs.keys()),
    }), paginationAdapters = pagination_adapters_1.PaginationAdapters, } = config;
    return {
        ...config,
        gatsbyFieldAliases,
        idTransform,
        typeNameTransform,
        paginationAdapters,
        formatLogMessage: format_log_message_1.formatLogMessage,
    };
}
exports.createSourcingContext = createSourcingContext;
//# sourceMappingURL=sourcing-context.js.map