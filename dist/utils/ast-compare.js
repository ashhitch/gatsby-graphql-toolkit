"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectionIncludes = exports.selectionSetIncludes = void 0;
function selectionSetIncludes(selectionSet, possibleSubset) {
    if (selectionSet === possibleSubset) {
        return true;
    }
    if (!selectionSet || !possibleSubset) {
        return false;
    }
    // Perf:
    if (possibleSubset.selections.length > selectionSet.selections.length) {
        return false;
    }
    return possibleSubset.selections.every(a => selectionSet.selections.some(b => selectionIncludes(b, a)));
}
exports.selectionSetIncludes = selectionSetIncludes;
function selectionIncludes(selection, possibleSubset) {
    var _a, _b, _c, _d;
    if (selection === possibleSubset) {
        return true;
    }
    if (!selection || !possibleSubset) {
        return false;
    }
    if (selection.kind === "FragmentSpread" &&
        possibleSubset.kind === "FragmentSpread") {
        return selection.name.value === possibleSubset.name.value;
    }
    if (selection.kind === "InlineFragment" &&
        possibleSubset.kind === "InlineFragment") {
        return (((_a = selection.typeCondition) === null || _a === void 0 ? void 0 : _a.name.value) ===
            ((_b = possibleSubset.typeCondition) === null || _b === void 0 ? void 0 : _b.name.value) &&
            selectionSetIncludes(selection.selectionSet, possibleSubset.selectionSet));
    }
    if (selection.kind === "Field" && possibleSubset.kind === "Field") {
        return (((_c = selection.alias) === null || _c === void 0 ? void 0 : _c.value) === ((_d = possibleSubset.alias) === null || _d === void 0 ? void 0 : _d.value) &&
            selection.name.value === possibleSubset.name.value &&
            selectionSetIncludes(selection.selectionSet, possibleSubset.selectionSet));
    }
    return false;
}
exports.selectionIncludes = selectionIncludes;
//# sourceMappingURL=ast-compare.js.map