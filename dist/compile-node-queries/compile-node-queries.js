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
exports.compileNodeQueries = void 0;
const graphql_1 = require("graphql");
const lodash_1 = require("lodash");
const default_gatsby_field_aliases_1 = require("../config/default-gatsby-field-aliases");
const add_variable_definitions_1 = require("./ast-transformers/add-variable-definitions");
const alias_gatsby_node_fields_1 = require("./ast-transformers/alias-gatsby-node-fields");
const add_node_fragment_spreads_and_typename_1 = require("./ast-transformers/add-node-fragment-spreads-and-typename");
const remove_unused_fragments_1 = require("./ast-transformers/remove-unused-fragments");
const compile_fragments_1 = require("./compile-fragments");
const ast_predicates_1 = require("../utils/ast-predicates");
const upgrade_prompt_1 = require("../utils/upgrade-prompt");
const build_node_reference_fragment_map_1 = require("./analyze/build-node-reference-fragment-map");
const build_type_usages_map_1 = require("./analyze/build-type-usages-map");
const ast_compare_1 = require("../utils/ast-compare");
const add_remote_typename_field_1 = require("./ast-transformers/add-remote-typename-field");
const GraphQLAST = __importStar(require("../utils/ast-nodes"));
/**
 * Combines `queries` from node types config with any user-defined
 * fragments and produces final queries used for node sourcing.
 */
function compileNodeQueries(args) {
    (0, upgrade_prompt_1.promptUpgradeIfRequired)(args.gatsbyNodeTypes);
    const context = createCompilationContext(args);
    const nodeFragmentMap = (0, compile_fragments_1.compileNodeFragments)(context);
    // Node fragments may still spread non-node fragments
    // For example:
    //
    // fragment User on User {
    //   dateOfBirth { ...UtcTime }
    // }
    //
    // In this case the document must also contain this UtcTime fragment:
    // fragment UtcTime on DateTime {
    //   utcTime
    // }
    //
    // So we add all non node fragments to all documents, but then
    // filtering out unused fragments
    const allNonNodeFragments = (0, compile_fragments_1.compileNonNodeFragments)(context);
    const documents = new Map();
    args.gatsbyNodeTypes.forEach(config => {
        var _a;
        const def = compileDocument(context, config.remoteTypeName, (_a = nodeFragmentMap.get(config.remoteTypeName)) !== null && _a !== void 0 ? _a : [], allNonNodeFragments);
        documents.set(config.remoteTypeName, def);
    });
    return documents;
}
exports.compileNodeQueries = compileNodeQueries;
function compileDocument(context, remoteTypeName, nodeFragments, nonNodeFragments) {
    const queries = context.originalConfigQueries.get(remoteTypeName);
    if (!queries) {
        throw new Error(`Could not find "queries" config for type "${remoteTypeName}"`);
    }
    // Remove redundant node fragments that contain the same fields as the id fragment
    // (doesn't affect query results but makes queries more readable):
    const prettifiedNodeFragments = removeIdFragmentDuplicates(context, nodeFragments, getIdFragment(remoteTypeName, queries));
    const typeInfo = new graphql_1.TypeInfo(context.schema);
    let fragmentsDocument = GraphQLAST.document([
        ...prettifiedNodeFragments,
        ...nonNodeFragments,
    ]);
    // Adding automatic __typename to custom fragments only
    // (original query and ID fragment must not be altered)
    fragmentsDocument = (0, graphql_1.visit)(fragmentsDocument, (0, graphql_1.visitWithTypeInfo)(typeInfo, (0, add_remote_typename_field_1.addRemoteTypeNameField)({ typeInfo })));
    const fullDocument = {
        ...queries,
        definitions: [...queries.definitions, ...fragmentsDocument.definitions],
    };
    // Expected query variants:
    //  1. { allUser { ...IDFragment } }
    //  2. { allNode(type: "User") { ...IDFragment } }
    //
    // We want to transform them to:
    //  1. { allUser { ...IDFragment ...UserFragment1 ...UserFragment2 }}
    //  2. { allNode(type: "User") { ...IDFragment ...UserFragment1 ...UserFragment2 }}
    // TODO: optimize visitor keys
    let doc = (0, graphql_1.visit)(fullDocument, (0, add_node_fragment_spreads_and_typename_1.addNodeFragmentSpreadsAndTypename)(prettifiedNodeFragments));
    doc = (0, graphql_1.visit)(doc, (0, graphql_1.visitWithTypeInfo)(typeInfo, (0, alias_gatsby_node_fields_1.aliasGatsbyNodeFields)({ ...context, typeInfo })));
    doc = (0, graphql_1.visit)(doc, (0, graphql_1.visitWithTypeInfo)(typeInfo, (0, add_variable_definitions_1.addVariableDefinitions)({ typeInfo })));
    return (0, graphql_1.visit)(doc, (0, remove_unused_fragments_1.removeUnusedFragments)());
}
function getIdFragment(remoteTypeName, doc) {
    // Assume ID fragment is listed first
    const idFragment = doc.definitions.find(ast_predicates_1.isFragment);
    if (!idFragment) {
        throw new Error(`Missing ID Fragment in type config for "${remoteTypeName}"`);
    }
    return idFragment;
}
function removeIdFragmentDuplicates(context, fragments, idFragment) {
    // The caveat is that a custom fragment may already have aliases but ID fragment hasn't:
    //
    // fragment Foo on Foo {
    //   remoteTypeName: __typename
    // }
    //
    // ID fragment:
    // fragment _FooId_ on Foo {
    //   __typename
    //   id
    // }
    // So before comparing selections we must "normalize" both to the form they
    // will be in the actual query
    const typeInfo = new graphql_1.TypeInfo(context.schema);
    let fragmentsWithAliases = GraphQLAST.document(fragments);
    const idFragmentWithAliases = (0, graphql_1.visit)(idFragment, (0, graphql_1.visitWithTypeInfo)(typeInfo, (0, alias_gatsby_node_fields_1.aliasGatsbyNodeFields)({ ...context, typeInfo })));
    fragmentsWithAliases = (0, graphql_1.visit)(fragmentsWithAliases, (0, graphql_1.visitWithTypeInfo)(typeInfo, (0, alias_gatsby_node_fields_1.aliasGatsbyNodeFields)({ ...context, typeInfo })));
    const deduped = new Set(fragmentsWithAliases.definitions
        .filter((def) => (0, ast_predicates_1.isFragment)(def) &&
        def.name.value !== idFragment.name.value &&
        !(0, ast_compare_1.selectionSetIncludes)(idFragmentWithAliases.selectionSet, def.selectionSet))
        .map(fragment => fragment.name.value));
    return fragments.filter(f => deduped.has(f.name.value));
}
function createCompilationContext(args) {
    var _a;
    const allFragmentDocs = [];
    args.customFragments.forEach(fragmentString => {
        allFragmentDocs.push((0, graphql_1.parse)(fragmentString));
    });
    const fragments = (0, lodash_1.flatMap)(allFragmentDocs, doc => doc.definitions.filter(ast_predicates_1.isFragment));
    return {
        schema: args.schema,
        nodeReferenceFragmentMap: (0, build_node_reference_fragment_map_1.buildNodeReferenceFragmentMap)(args),
        typeUsagesMap: (0, build_type_usages_map_1.buildTypeUsagesMap)({ ...args, fragments }),
        gatsbyNodeTypes: args.gatsbyNodeTypes.reduce((map, config) => map.set(config.remoteTypeName, config), new Map()),
        originalConfigQueries: args.gatsbyNodeTypes.reduce((map, config) => map.set(config.remoteTypeName, (0, graphql_1.parse)(config.queries)), new Map()),
        originalCustomFragments: fragments,
        gatsbyFieldAliases: (_a = args.gatsbyFieldAliases) !== null && _a !== void 0 ? _a : default_gatsby_field_aliases_1.defaultGatsbyFieldAliases,
    };
}
//# sourceMappingURL=compile-node-queries.js.map