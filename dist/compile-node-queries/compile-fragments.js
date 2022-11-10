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
exports.compileNonNodeFragments = exports.compileNodeFragments = void 0;
const graphql_1 = require("graphql");
const GraphQLAST = __importStar(require("../utils/ast-nodes"));
const replace_node_selection_with_reference_1 = require("./ast-transformers/replace-node-selection-with-reference");
const ast_predicates_1 = require("../utils/ast-predicates");
/**
 * Compiles all user-defined custom fragments into "node fragments".
 *
 * "Node fragment" is a fragment that:
 * 1. Is defined on gatsby node type
 * 2. Is "shallow", meaning that all deep selections of other nodes
 *    are replaced with references
 *
 * For example:
 *
 * fragment Post on Post {
 *   title
 *   author {
 *     firstName
 *     email
 *   }
 * }
 * fragment User on User {
 *   lastName
 *   recentPosts {
 *     updatedAt
 *   }
 * }
 *
 * Is compiled into a map:
 * "Post": `
 * fragment Post on Post {
 *   title
 *   author {
 *     __typename
 *     id
 *   }
 * }
 * fragment User__recentPosts on Post {
 *   updatedAt
 * }
 * `,
 * "User": `
 * fragment User on User {
 *   lastName
 *   recentPosts {
 *     __typename
 *     id
 *   }
 * }
 * fragment Post__author on User {
 *   firstName
 *   email
 * }
 * `
 */
function compileNodeFragments(context) {
    const nodeFragments = new Map();
    for (const nodeConfig of context.gatsbyNodeTypes.values()) {
        nodeFragments.set(nodeConfig.remoteTypeName, compileNormalizedNodeFragments(context, nodeConfig));
    }
    return nodeFragments;
}
exports.compileNodeFragments = compileNodeFragments;
function compileNormalizedNodeFragments(context, gatsbyNodeConfig) {
    var _a;
    const { schema, typeUsagesMap } = context;
    const type = schema.getType(gatsbyNodeConfig.remoteTypeName);
    if (!(0, graphql_1.isObjectType)(type)) {
        return [];
    }
    const allTypes = [
        gatsbyNodeConfig.remoteTypeName,
        ...type.getInterfaces().map(iface => iface.name),
    ];
    const result = [];
    for (const typeName of allTypes) {
        const typeUsages = (_a = typeUsagesMap.get(typeName)) !== null && _a !== void 0 ? _a : [];
        for (const [typeUsagePath, fields] of typeUsages) {
            result.push(GraphQLAST.fragmentDefinition(typeUsagePath, typeName, fields));
        }
    }
    return addNodeReferences(context, result);
}
function compileNonNodeFragments(context) {
    const nonNodeFragments = findAllNonNodeFragments(context);
    return addNodeReferences(context, nonNodeFragments);
}
exports.compileNonNodeFragments = compileNonNodeFragments;
function addNodeReferences(context, fragments) {
    const { schema, originalCustomFragments, nodeReferenceFragmentMap } = context;
    const typeInfo = new graphql_1.TypeInfo(schema);
    const visitContext = {
        schema,
        nodeReferenceFragmentMap,
        originalCustomFragments,
        typeInfo,
    };
    let doc = (0, graphql_1.visit)(GraphQLAST.document(fragments), (0, graphql_1.visitWithTypeInfo)(typeInfo, (0, replace_node_selection_with_reference_1.replaceNodeSelectionWithReference)(visitContext)));
    return doc.definitions.filter(ast_predicates_1.isFragment);
}
function findAllNonNodeFragments(args) {
    const nodeTypes = new Set();
    args.gatsbyNodeTypes.forEach(def => {
        const type = args.schema.getType(def.remoteTypeName);
        if (!(0, graphql_1.isObjectType)(type)) {
            return;
        }
        nodeTypes.add(type.name);
        type.getInterfaces().forEach(iface => {
            nodeTypes.add(iface.name);
        });
    });
    return args.originalCustomFragments.filter(fragment => !nodeTypes.has(fragment.typeCondition.name.value));
}
//# sourceMappingURL=compile-fragments.js.map