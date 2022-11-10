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
exports.addRemoteTypeNameField = void 0;
const graphql_1 = require("graphql");
const GraphQLAST = __importStar(require("../../utils/ast-nodes"));
const ast_predicates_1 = require("../../utils/ast-predicates");
/**
 * Adds __typename to all fields of composite types, i.e. transforms:
 * ```
 * {
 *   node { foo }
 * }
 * ```
 * to
 * ```
 * {
 *   node { __typename foo }
 * }
 * ```
 * (where `node` is of Object, Interface or Union type)
 */
function addRemoteTypeNameField({ typeInfo, }) {
    return {
        SelectionSet: (node, _, parent) => {
            const type = typeInfo.getType();
            if (type &&
                (0, ast_predicates_1.isNode)(parent) &&
                (0, ast_predicates_1.isField)(parent) &&
                !hasTypenameField(node) &&
                (0, graphql_1.isCompositeType)((0, graphql_1.getNamedType)(type))) {
                return {
                    ...node,
                    selections: [GraphQLAST.field(`__typename`), ...node.selections],
                };
            }
            return;
        },
    };
}
exports.addRemoteTypeNameField = addRemoteTypeNameField;
function hasTypenameField(node) {
    return node.selections.some(ast_predicates_1.isTypeNameField);
}
//# sourceMappingURL=add-remote-typename-field.js.map