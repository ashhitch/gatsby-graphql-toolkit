import { ASTVisitor } from "graphql";
/**
 * Strip unnecessary wrapping (just a prettify)
 * i.e. { ...on InterfaceType { ...on ObjectType1 ...on ObjectType2 } }
 *   -> { ...on ObjectType1 ...on ObjectType2 }
 */
export declare function stripWrappingFragments(): ASTVisitor;
