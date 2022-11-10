import { TypeInfo, ASTVisitor } from "graphql";
interface IAddVariableDefinitionsArgs {
    typeInfo: TypeInfo;
}
export declare function addVariableDefinitions({ typeInfo, }: IAddVariableDefinitionsArgs): ASTVisitor;
export {};
