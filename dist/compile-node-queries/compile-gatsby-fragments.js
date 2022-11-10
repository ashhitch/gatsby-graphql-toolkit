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
exports.compileGatsbyFragments = void 0;
const graphql_1 = require("graphql");
const lodash_1 = require("lodash");
const default_gatsby_field_aliases_1 = require("../config/default-gatsby-field-aliases");
const alias_gatsby_node_fields_1 = require("./ast-transformers/alias-gatsby-node-fields");
const ast_predicates_1 = require("../utils/ast-predicates");
const GraphQLAST = __importStar(require("../utils/ast-nodes"));
const type_name_transform_1 = require("../config/type-name-transform");
const ast_transform_1 = require("../utils/ast-transform");
/**
 * Takes a list of custom source fragments and transforms them to
 * a list of gatsby fragments.
 *
 * E.g.
 * fragment PostAuthor on Author {
 *   id
 *   name
 *   allPosts {
 *     excerpt: description(truncateAt: 200)
 *   }
 * }
 *
 * is compiled to the following Gatsby fragment:
 *
 * fragment PostAuthor on MyAuthor {
 *   id
 *   name
 *   allPosts {
 *     excerpt
 *   }
 * }
 */
function compileGatsbyFragments(args) {
    const allFragmentDocs = [];
    args.customFragments.forEach(fragmentString => {
        allFragmentDocs.push((0, graphql_1.parse)(fragmentString));
    });
    const fragments = (0, lodash_1.flatMap)(allFragmentDocs, doc => doc.definitions.filter(ast_predicates_1.isFragment));
    let doc = GraphQLAST.document(fragments);
    doc = ensureGatsbyFieldAliases(args, doc);
    doc = useFieldAliases(doc);
    doc = stripArguments(doc);
    doc = stripNonSpecDirectives(doc);
    return prefixTypeConditions(args, doc);
}
exports.compileGatsbyFragments = compileGatsbyFragments;
function ensureGatsbyFieldAliases(args, doc) {
    var _a;
    const typeInfo = new graphql_1.TypeInfo(args.schema);
    return (0, graphql_1.visit)(doc, (0, graphql_1.visitWithTypeInfo)(typeInfo, (0, alias_gatsby_node_fields_1.aliasGatsbyNodeFields)({
        schema: args.schema,
        gatsbyNodeTypes: args.gatsbyNodeTypes.reduce((map, config) => map.set(config.remoteTypeName, config), new Map()),
        typeInfo,
        gatsbyFieldAliases: (_a = args.gatsbyFieldAliases) !== null && _a !== void 0 ? _a : default_gatsby_field_aliases_1.defaultGatsbyFieldAliases,
    })));
}
function stripNonSpecDirectives(doc) {
    const specifiedDirectiveNames = new Set(graphql_1.specifiedDirectives.map(directive => directive.name));
    return (0, graphql_1.visit)(doc, {
        Directive: (node) => {
            if (specifiedDirectiveNames.has(node.name.value)) {
                return undefined;
            }
            // Delete the node
            return null;
        },
    });
}
function stripArguments(doc) {
    return (0, graphql_1.visit)(doc, {
        Field: (node) => {
            if (!node.arguments) {
                return undefined;
            }
            return {
                ...node,
                arguments: undefined,
            };
        },
    });
}
function useFieldAliases(doc) {
    return (0, graphql_1.visit)(doc, {
        Field: (node) => {
            if (!node.alias) {
                return undefined;
            }
            return {
                ...node,
                alias: undefined,
                name: node.alias,
            };
        },
    });
}
function prefixTypeConditions(args, doc) {
    var _a;
    const typeNameTransform = (_a = args.typeNameTransform) !== null && _a !== void 0 ? _a : (0, type_name_transform_1.createTypeNameTransform)({
        gatsbyTypePrefix: args.gatsbyTypePrefix,
        gatsbyNodeTypeNames: args.gatsbyNodeTypes.map(type => type.remoteTypeName),
    });
    return (0, graphql_1.visit)(doc, {
        InlineFragment: (node) => {
            if (!node.typeCondition) {
                return undefined;
            }
            return {
                ...node,
                typeCondition: (0, ast_transform_1.renameNode)(node.typeCondition, typeNameTransform.toGatsbyTypeName),
            };
        },
        FragmentDefinition: (node) => {
            return {
                ...node,
                typeCondition: (0, ast_transform_1.renameNode)(node.typeCondition, typeNameTransform.toGatsbyTypeName),
            };
        },
    });
}
//# sourceMappingURL=compile-gatsby-fragments.js.map