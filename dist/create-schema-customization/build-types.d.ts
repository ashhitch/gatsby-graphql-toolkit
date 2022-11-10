import { GatsbyGraphQLType } from "gatsby";
import { ISchemaCustomizationContext } from "../types";
export declare function buildTypeDefinition(context: ISchemaCustomizationContext, remoteTypeName: string): GatsbyGraphQLType | void;
export declare function buildTypeDefinitions(context: ISchemaCustomizationContext): GatsbyGraphQLType[];
