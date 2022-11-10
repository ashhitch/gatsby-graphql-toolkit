import { ITypeNameTransform, RemoteTypeName } from "../types";
interface ITypeNameTransformArgs {
    gatsbyTypePrefix: string;
    gatsbyNodeTypeNames: RemoteTypeName[];
}
export declare function createTypeNameTransform(config: ITypeNameTransformArgs): ITypeNameTransform;
export {};
