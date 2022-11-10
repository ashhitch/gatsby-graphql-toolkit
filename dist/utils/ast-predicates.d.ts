import { ASTNode, DefinitionNode, FieldNode, FragmentDefinitionNode, FragmentSpreadNode, OperationDefinitionNode, SelectionNode } from "graphql";
export declare function isNode(node: unknown): node is ASTNode;
export declare function isFragment(node: ASTNode): node is FragmentDefinitionNode;
export declare function isOperation(node: ASTNode): node is OperationDefinitionNode;
export declare function isField(node: ASTNode): node is FieldNode;
export declare function isFragmentSpread(node: ASTNode): node is FragmentSpreadNode;
export declare function isNonEmptyFragment(fragment: DefinitionNode): fragment is FragmentDefinitionNode;
export declare function isTypeNameField(selection: SelectionNode): boolean;
