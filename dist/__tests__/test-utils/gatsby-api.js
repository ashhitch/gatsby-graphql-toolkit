"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatsbyApi = exports.gatsbyApiFake = void 0;
const type_builders_1 = require("gatsby/dist/schema/types/type-builders");
exports.gatsbyApiFake = {
    schema: {
        buildObjectType: type_builders_1.buildObjectType,
        buildUnionType: type_builders_1.buildUnionType,
        buildInterfaceType: type_builders_1.buildInterfaceType,
        buildInputObjectType: type_builders_1.buildInputObjectType,
        buildEnumType: type_builders_1.buildEnumType,
        buildScalarType: type_builders_1.buildScalarType,
    },
};
exports.gatsbyApi = exports.gatsbyApiFake;
//# sourceMappingURL=gatsby-api.js.map