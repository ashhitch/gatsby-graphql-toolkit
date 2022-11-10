"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNodeIdTransform = void 0;
const lodash_1 = require("lodash");
const ast_predicates_1 = require("../utils/ast-predicates");
function createNodeIdTransform() {
    return {
        remoteNodeToGatsbyId(remoteNode, def) {
            const remoteId = this.remoteNodeToId(remoteNode, def);
            return this.remoteIdToGatsbyNodeId(remoteId, def);
        },
        gatsbyNodeToRemoteId(gatsbyNode, def) {
            const idFragment = getIdFragment(def);
            return getSelectionValues(gatsbyNode, idFragment.selectionSet.selections);
        },
        remoteIdToGatsbyNodeId(remoteId, 
        // @ts-ignore
        def) {
            // TODO: stable sorting as in the id fragment?
            // TODO: validate remote id (make sure it has all the fields as defined)
            const idValues = flatObjectValues(remoteId);
            return idValues.join(`:`);
        },
        remoteNodeToId(remoteNode, def) {
            const idFragment = getIdFragment(def);
            return getSelectionValues(remoteNode, idFragment.selectionSet.selections);
        },
    };
    function getIdFragment(def) {
        const fragment = def.document.definitions.find(ast_predicates_1.isFragment);
        if (!fragment) {
            throw new Error(`Every node type definition is expected to contain a fragment ` +
                `with ID fields for this node type. Definition for ${def.remoteTypeName} has none.`);
        }
        return fragment;
    }
    function getSelectionValues(obj, selections) {
        var _a, _b, _c;
        const result = Object.create(null);
        for (const selection of selections) {
            if (!(0, ast_predicates_1.isField)(selection)) {
                throw new Error("Expecting fields only");
            }
            const nestedFields = (_b = (_a = selection.selectionSet) === null || _a === void 0 ? void 0 : _a.selections) !== null && _b !== void 0 ? _b : [];
            const alias = (_c = selection.alias) !== null && _c !== void 0 ? _c : selection.name;
            const fieldName = alias.value;
            const fieldValue = obj[fieldName];
            if (isNullish(fieldValue)) {
                throw new Error(`Value of the ID field "${fieldName}" can't be nullish. ` +
                    `Got object with keys: ${Object.keys(obj).join(`, `)}`);
            }
            if (nestedFields.length > 0 && typeof fieldValue !== `object`) {
                throw new Error("Expecting object value for a field with selection");
            }
            result[fieldName] =
                nestedFields.length > 0
                    ? getSelectionValues(fieldValue, nestedFields)
                    : fieldValue;
        }
        return result;
    }
    function flatObjectValues(obj) {
        return (0, lodash_1.flatMap)(Object.values(obj), value => typeof value === `object` && value !== null
            ? flatObjectValues(value)
            : value);
    }
}
exports.createNodeIdTransform = createNodeIdTransform;
function isNullish(value) {
    return typeof value === `undefined` || value === null;
}
//# sourceMappingURL=node-id-transform.js.map