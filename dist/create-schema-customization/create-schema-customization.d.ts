import { ISchemaCustomizationContext, ISourcingConfig } from "../types";
/**
 * Uses sourcing config to define Gatsby types explicitly
 * (using Gatsby schema customization API).
 */
export declare function createSchemaCustomization(config: ISourcingConfig): Promise<void>;
export declare function createSchemaCustomizationContext(config: ISourcingConfig): ISchemaCustomizationContext;
