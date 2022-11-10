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
exports.generateDefaultFragmentNodes = exports.generateDefaultFragments = void 0;
const graphql_1 = require("graphql");
const GraphQLAST = __importStar(require("../utils/ast-nodes"));
const default_gatsby_field_aliases_1 = require("../config/default-gatsby-field-aliases");
const alias_gatsby_node_fields_1 = require("./ast-transformers/alias-gatsby-node-fields");
const strip_wrapping_fragments_1 = require("./ast-transformers/strip-wrapping-fragments");
const build_node_reference_fragment_map_1 = require("./analyze/build-node-reference-fragment-map");
const upgrade_prompt_1 = require("../utils/upgrade-prompt");
/**
 * Utility function that generates default fragments for every gatsby node type
 */
function generateDefaultFragments(config) {
    (0, upgrade_prompt_1.promptUpgradeIfRequired)(config.gatsbyNodeTypes);
    const result = new Map();
    for (const [name, fragment] of generateDefaultFragmentNodes(config)) {
        result.set(name, (0, graphql_1.print)(fragment));
    }
    return result;
}
exports.generateDefaultFragments = generateDefaultFragments;
function generateDefaultFragmentNodes(config) {
    const context = {
        gatsbyFieldAliases: {
            ...default_gatsby_field_aliases_1.defaultGatsbyFieldAliases,
            ...config.gatsbyFieldAliases,
        },
        schema: config.schema,
        gatsbyNodeTypes: config.gatsbyNodeTypes.reduce((map, config) => map.set(config.remoteTypeName, config), new Map()),
        fragmentMap: buildTypeFragmentMap(config),
        nodeReferenceFragmentMap: (0, build_node_reference_fragment_map_1.buildNodeReferenceFragmentMap)(config),
    };
    const nodeFragments = new Map();
    for (const nodeConfig of config.gatsbyNodeTypes) {
        nodeFragments.set(nodeConfig.remoteTypeName, generateDefaultFragment(context, nodeConfig));
    }
    return nodeFragments;
}
exports.generateDefaultFragmentNodes = generateDefaultFragmentNodes;
function generateDefaultFragment(context, nodeConfig) {
    const fragment = context.fragmentMap.get(nodeConfig.remoteTypeName);
    if (!fragment) {
        throw new Error(`Unknown remote GraphQL type ${nodeConfig.remoteTypeName}`);
    }
    // Note:
    //  if some visitor edits a node, the next visitors won't see this node
    //  so conflicts are possible (in this case several passes are required)
    const typeInfo = new graphql_1.TypeInfo(context.schema);
    const visitor = (0, graphql_1.visitInParallel)([
        inlineNamedFragments(context),
        (0, alias_gatsby_node_fields_1.aliasGatsbyNodeFields)({ ...context, typeInfo }),
        (0, strip_wrapping_fragments_1.stripWrappingFragments)(),
    ]);
    return (0, graphql_1.visit)(fragment, (0, graphql_1.visitWithTypeInfo)(typeInfo, visitor));
}
function inlineNamedFragments(args) {
    const typeStack = [];
    return {
        FragmentSpread: (node, _, __) => {
            var _a;
            const typeName = node.name.value; // Assuming fragment name matches type name
            if (typeStack.includes(typeName)) {
                // TODO: allow configurable number of nesting levels?
                // Replace the spread with a single __typename field to break the cycle
                // FIXME: delete parent field in this case vs replacing with __typename
                return GraphQLAST.field(`__typename`, args.gatsbyFieldAliases[`__typename`]);
            }
            typeStack.push(typeName);
            const typeFragment = (_a = args.nodeReferenceFragmentMap.get(typeName)) !== null && _a !== void 0 ? _a : args.fragmentMap.get(typeName);
            if (!typeFragment) {
                throw new Error(`Missing fragment for type ${typeName}`);
            }
            return GraphQLAST.inlineFragment(typeName, typeFragment.selectionSet.selections);
        },
        InlineFragment: {
            leave() {
                // Corresponding enter is actually in the FragmentSpread above
                // (FragmentSpread has no "leave" because we replace it with inline fragment or remove)
                typeStack.pop();
            },
        },
    };
}
/**
 * Create a fragment for every composite type (object, interface, union)
 * And put it to a Map<TypeName, FragmentDefinitionNode>.
 *
 * Fragment name is the same as the type name.
 *
 * Each fragment contains ALL fields of the type (arguments are omitted).
 * Fragments of this map MAY have cycles (see example below).
 *
 * This intermediate map is later used to generate final node fragment
 * by inlining and transforming specific named fragments.
 *
 * Example of generated fragments:
 *
 * ```graphql
 * fragment ObjectType on ObjectType {
 *   __typename
 *   scalar
 *   interface {
 *     ...InterfaceType
 *   }
 *   union {
 *     ...UnionType
 *   }
 *   object {
 *     ...ObjectType
 *   }
 * }
 *
 * # Fragments on abstract types simply contain __typename
 * fragment UnionType on UnionType {
 *   __typename
 * }
 * fragment InterfaceType on InterfaceType {
 *   __typename
 * }
 * ```
 */
function buildTypeFragmentMap(config) {
    const typeMap = config.schema.getTypeMap();
    const fragmentMap = new Map();
    Object.keys(typeMap).forEach(typeName => {
        const type = typeMap[typeName];
        const fragment = (0, graphql_1.isCompositeType)(type)
            ? buildTypeFragment(config, type)
            : undefined;
        if (fragment) {
            fragmentMap.set(typeName, fragment);
        }
    });
    return fragmentMap;
}
function buildTypeFragment(context, type) {
    return (0, graphql_1.isAbstractType)(type)
        ? buildAbstractTypeFragment(context, type)
        : buildObjectTypeFragment(context, type);
}
function buildAbstractTypeFragment(context, type) {
    const fragmentName = getTypeFragmentName(type.name);
    const selections = context.schema
        .getPossibleTypes(type)
        .map(objectType => GraphQLAST.fragmentSpread(getTypeFragmentName(objectType.name)));
    return GraphQLAST.fragmentDefinition(fragmentName, type.name, selections);
}
function buildObjectTypeFragment(context, type) {
    const fragmentName = getTypeFragmentName(type.name);
    const selections = Object.keys(type.getFields())
        .map(fieldName => buildFieldNode(context, type, fieldName))
        .filter((node) => Boolean(node));
    return GraphQLAST.fragmentDefinition(fragmentName, type.name, selections);
}
function buildFieldNode(context, parentType, fieldName) {
    const field = parentType.getFields()[fieldName];
    if (!field) {
        return;
    }
    const type = (0, graphql_1.getNamedType)(field.type);
    const args = resolveFieldArguments(context, parentType, field);
    // Make sure all nonNull args are resolved
    if (someNonNullArgMissing(field, args)) {
        return;
    }
    const selections = (0, graphql_1.isCompositeType)(type)
        ? [GraphQLAST.fragmentSpread(getTypeFragmentName(type.name))]
        : undefined;
    return GraphQLAST.field(fieldName, undefined, args, selections);
}
function resolveFieldArguments(context, parentType, field) {
    var _a;
    // We have two sources of arguments:
    // 1. Default argument values for type field
    // 2. Pagination adapters (i.e. limit/offset or first/after, etc)
    if (field.args.length === 0) {
        return [];
    }
    const defaultArgValueProviders = (_a = context.defaultArgumentValues) !== null && _a !== void 0 ? _a : [];
    const argValues = defaultArgValueProviders.reduce((argValues, resolver) => { var _a; return Object.assign(argValues, (_a = resolver(field, parentType)) !== null && _a !== void 0 ? _a : {}); }, Object.create(null));
    return field.args
        .map(arg => {
        const valueNode = (0, graphql_1.astFromValue)(argValues[arg.name], arg.type);
        return valueNode ? GraphQLAST.arg(arg.name, valueNode) : undefined;
    })
        .filter((arg) => Boolean(arg));
}
function someNonNullArgMissing(field, argNodes) {
    return field.args.some(arg => (0, graphql_1.isNonNullType)(arg.type) &&
        argNodes.every(argNode => argNode.name.value !== arg.name));
}
function getTypeFragmentName(typeName) {
    return typeName;
}
//# sourceMappingURL=generate-default-fragments.js.map