import { FieldNode, TypeInfo, GraphQLSchema, GraphQLCompositeType, ASTVisitor } from "graphql";
import { IGatsbyFieldAliases, IGatsbyNodeConfig, RemoteTypeName } from "../../types";
interface IAliasGatsbyNodeFieldsArgs {
    gatsbyNodeTypes: Map<RemoteTypeName, IGatsbyNodeConfig>;
    gatsbyFieldAliases: IGatsbyFieldAliases;
    typeInfo: TypeInfo;
    schema: GraphQLSchema;
}
export declare function aliasGatsbyNodeFields(args: IAliasGatsbyNodeFieldsArgs): ASTVisitor;
export declare function isNodeType(type: GraphQLCompositeType | null | void, args: IAliasGatsbyNodeFieldsArgs): boolean;
export declare function aliasField(node: FieldNode, map: IGatsbyFieldAliases): FieldNode | void;
export {};
