import { DocumentNode } from "graphql";
import { ASTReducer } from "graphql/language/visitor";
export declare function removeUnusedFragments(): ASTReducer<DocumentNode | void>;
