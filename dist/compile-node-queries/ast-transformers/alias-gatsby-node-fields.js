"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aliasField = exports.isNodeType = exports.aliasGatsbyNodeFields = void 0;
const graphql_1 = require("graphql");
const GraphQLAST = __importStar(require("../../utils/ast-nodes"));
function aliasGatsbyNodeFields(args) {
    return {
        Field: (node) => {
            if (isTypeName(node) || isNodeType(args.typeInfo.getParentType(), args)) {
                return aliasField(node, args.gatsbyFieldAliases);
            }
            return undefined;
        },
    };
}
exports.aliasGatsbyNodeFields = aliasGatsbyNodeFields;
function isTypeName(node) {
    return (node.name.value === `__typename` &&
        (!node.alias || node.alias.value === `__typename`));
}
function isNodeType(type, args) {
    if (!type) {
        return false;
    }
    if ((0, graphql_1.isUnionType)(type)) {
        return false;
    }
    if ((0, graphql_1.isObjectType)(type)) {
        return args.gatsbyNodeTypes.has(type.name);
    }
    // Interface type
    const possibleTypes = args.schema.getPossibleTypes(type);
    return possibleTypes.some(possibleType => isNodeType(possibleType, args));
}
exports.isNodeType = isNodeType;
function aliasField(node, map) {
    if (!map[node.name.value]) {
        return;
    }
    const alias = map[node.name.value];
    const newFieldNode = {
        ...node,
        alias: GraphQLAST.name(alias),
    };
    return newFieldNode;
}
exports.aliasField = aliasField;
//# sourceMappingURL=alias-gatsby-node-fields.js.map