"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripWrappingFragments = void 0;
/**
 * Strip unnecessary wrapping (just a prettify)
 * i.e. { ...on InterfaceType { ...on ObjectType1 ...on ObjectType2 } }
 *   -> { ...on ObjectType1 ...on ObjectType2 }
 */
function stripWrappingFragments() {
    return {
        SelectionSet: {
            leave: (node) => {
                if (node.selections.length !== 1 ||
                    node.selections[0].kind !== "InlineFragment") {
                    return;
                }
                const inlineFragment = node.selections[0];
                const isWrapper = inlineFragment.selectionSet.selections.every(selection => selection.kind === "FragmentSpread" ||
                    selection.kind === "InlineFragment");
                return isWrapper ? inlineFragment.selectionSet : undefined;
            },
        },
    };
}
exports.stripWrappingFragments = stripWrappingFragments;
//# sourceMappingURL=strip-wrapping-fragments.js.map