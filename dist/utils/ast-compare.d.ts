import { SelectionNode, SelectionSetNode } from "graphql";
export declare function selectionSetIncludes(selectionSet: SelectionSetNode | void, possibleSubset: SelectionSetNode | void): boolean;
export declare function selectionIncludes(selection: SelectionNode | void, possibleSubset: SelectionNode | void): boolean;
