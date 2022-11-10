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
exports.buildNodeReferenceFragmentMap = void 0;
const graphql_1 = require("graphql");
const lodash_1 = require("lodash");
const GraphQLAST = __importStar(require("../../utils/ast-nodes"));
const ast_predicates_1 = require("../../utils/ast-predicates");
/**
 * Create reference fragment for every node type
 * and put it to a Map<TypeName, FragmentDefinitionNode>.
 *
 * "Reference fragment" is a fragment that contains all necessary fields
 * required to find the actual node in gatsby store (i.e. type, id).
 *
 * For example:
 *
 * fragment NodeTypeReference on NodeType {
 *   __typename
 *   id
 * }
 *
 * Resulting map also includes fragments for node interfaces.
 * "Node interface" is an interface having only node types as it's implementors
 *
 * (if there is at least one non-node type then an interface
 * can not be considered a "node interface")
 */
function buildNodeReferenceFragmentMap({ schema, gatsbyNodeTypes: nodes, }) {
    const nodeReferenceFragmentMap = new Map();
    const possibleNodeInterfaces = [];
    const nodesMap = new Map();
    // Add reference fragments for simple node object types
    // TODO: move config validation to a separate step
    nodes.forEach((config, index) => {
        if (!config.remoteTypeName) {
            throw new Error(`Every node type definition is expected to have key "remoteTypeName". ` +
                `But definition at index ${index} has none.`);
        }
        if (!config.queries) {
            throw new Error(`Every node type definition is expected to have key "queries". ` +
                `But definition for ${config.remoteTypeName} has none.`);
        }
        const remoteTypeName = config.remoteTypeName;
        const nodeType = schema.getType(remoteTypeName);
        if (!(0, graphql_1.isObjectType)(nodeType)) {
            throw new Error(`Only object types can be defined as gatsby nodes. Got ${remoteTypeName} ` +
                `(for definition at index ${index})`);
        }
        const document = (0, graphql_1.parse)(config.queries);
        const fragments = document.definitions.filter(ast_predicates_1.isFragment);
        if (fragments.length !== 1) {
            throw new Error(`Every node type query is expected to contain a single fragment ` +
                `with ID fields for this node type. Definition for ${remoteTypeName} has none.`);
        }
        const idFragment = fragments[0];
        if (idFragment.typeCondition.name.value !== remoteTypeName) {
            throw new Error(`Fragment ${idFragment.name.value} for node type ${remoteTypeName} ` +
                `is incorrectly defined on type ${idFragment.typeCondition.name.value}`);
        }
        const referenceFragment = GraphQLAST.fragmentDefinition(remoteTypeName, remoteTypeName, [
            GraphQLAST.field(`__typename`),
            ...idFragment.selectionSet.selections.filter(selection => !(0, ast_predicates_1.isTypeNameField)(selection)),
        ]);
        nodeReferenceFragmentMap.set(remoteTypeName, referenceFragment);
        possibleNodeInterfaces.push(...nodeType.getInterfaces());
        nodesMap.set(remoteTypeName, referenceFragment);
    });
    // Detect node interfaces and add reference fragments for those
    // Node interface is any interface that has all of it's implementors configured
    //   as Gatsby node types and also having all ID fields of all implementors
    new Set(possibleNodeInterfaces).forEach(iface => {
        const possibleTypes = schema.getPossibleTypes(iface);
        if (!allPossibleTypesAreNodeTypes(possibleTypes, nodesMap)) {
            return;
        }
        const referenceFragment = combineReferenceFragments(iface.name, possibleTypes, nodesMap);
        if (!hasAllIdFields(iface, referenceFragment)) {
            return;
        }
        nodeReferenceFragmentMap.set(iface.name, referenceFragment);
    });
    return nodeReferenceFragmentMap;
}
exports.buildNodeReferenceFragmentMap = buildNodeReferenceFragmentMap;
function allPossibleTypesAreNodeTypes(possibleTypes, nodesMap) {
    return possibleTypes.every(type => nodesMap.has(type.name));
}
function combineReferenceFragments(interfaceName, possibleTypes, nodesMap) {
    const allIdFields = (0, lodash_1.flatMap)(possibleTypes, type => { var _a, _b; return (_b = (_a = nodesMap.get(type.name)) === null || _a === void 0 ? void 0 : _a.selectionSet.selections) !== null && _b !== void 0 ? _b : []; }).filter(ast_predicates_1.isField);
    const allReferenceFieldsWithoutTypename = dedupeFieldsRecursively(allIdFields.filter(f => (0, ast_predicates_1.isField)(f) && !(0, ast_predicates_1.isTypeNameField)(f)));
    return GraphQLAST.fragmentDefinition(interfaceName, interfaceName, [
        GraphQLAST.field(`__typename`),
        ...allReferenceFieldsWithoutTypename,
    ]);
}
function dedupeFieldsRecursively(fields) {
    const uniqueFields = new Map();
    fields.forEach(field => {
        var _a, _b, _c;
        const fieldName = field.name.value;
        const subFields = (_b = (_a = field.selectionSet) === null || _a === void 0 ? void 0 : _a.selections.filter(ast_predicates_1.isField)) !== null && _b !== void 0 ? _b : [];
        uniqueFields.set(fieldName, [
            ...((_c = uniqueFields.get(fieldName)) !== null && _c !== void 0 ? _c : []),
            ...subFields,
        ]);
    });
    const result = [];
    for (const [fieldName, subFields] of uniqueFields) {
        const field = GraphQLAST.field(fieldName, undefined, undefined, dedupeFieldsRecursively(subFields));
        result.push(field);
    }
    return result;
}
function hasAllIdFields(iface, idFragment) {
    // TODO: also check nested fields?
    const fields = iface.getFields();
    for (const field of idFragment.selectionSet.selections) {
        if (!(0, ast_predicates_1.isField)(field)) {
            return false;
        }
        const fieldName = field.name.value;
        if (!fields[fieldName] && fieldName !== `__typename`) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=build-node-reference-fragment-map.js.map