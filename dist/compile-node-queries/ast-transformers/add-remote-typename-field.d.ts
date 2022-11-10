import { TypeInfo, ASTVisitor } from "graphql";
interface IAddTypeNameArgs {
    typeInfo: TypeInfo;
}
/**
 * Adds __typename to all fields of composite types, i.e. transforms:
 * ```
 * {
 *   node { foo }
 * }
 * ```
 * to
 * ```
 * {
 *   node { __typename foo }
 * }
 * ```
 * (where `node` is of Object, Interface or Union type)
 */
export declare function addRemoteTypeNameField({ typeInfo, }: IAddTypeNameArgs): ASTVisitor;
export {};
