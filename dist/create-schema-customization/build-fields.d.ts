import { GatsbyGraphQLObjectType } from "gatsby";
import { ISchemaCustomizationContext } from "../types";
declare type FieldMap = NonNullable<GatsbyGraphQLObjectType["config"]["fields"]>;
/**
 * Transforms fields from the remote schema to work in the Gatsby schema
 * with proper node linking and type namespacing
 * also filters out unusable fields and types
 */
export declare function buildFields(context: ISchemaCustomizationContext, remoteTypeName: string): FieldMap;
export {};
