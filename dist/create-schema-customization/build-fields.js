"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFields = void 0;
const graphql_1 = require("graphql");
const field_transformers_1 = require("./transform-fields/field-transformers");
/**
 * Transforms fields from the remote schema to work in the Gatsby schema
 * with proper node linking and type namespacing
 * also filters out unusable fields and types
 */
function buildFields(context, remoteTypeName) {
    const remoteType = context.schema.getType(remoteTypeName);
    if (!(0, graphql_1.isObjectType)(remoteType) && !(0, graphql_1.isInterfaceType)(remoteType)) {
        throw new Error(`Cannot build fields for ${remoteType}. ` +
            `Expecting ${remoteType} to be an object or an interface type`);
    }
    const fields = collectGatsbyTypeFields(context, remoteType);
    return fields.reduce((fieldsConfig, field) => {
        const config = buildFieldConfig(context, field, remoteType);
        if (config) {
            fieldsConfig[field.gatsbyFieldName] = config;
        }
        return fieldsConfig;
    }, Object.create(null));
}
exports.buildFields = buildFields;
/**
 * Returns a list of fields to be added to Gatsby schema for this type.
 *
 * This list is an intersection of schema fields with fields and aliases from node queries for this type.
 * In other words only fields and aliases requested in node queries will be added to the schema.
 *
 * Also Note: the same field of the remote type may produce multiple fields in Gatsby type
 * (via aliases in the node query)
 */
function collectGatsbyTypeFields(context, remoteType) {
    var _a;
    const { sourcingPlan: { fetchedTypeMap }, typeNameTransform, } = context;
    const collectedFields = [];
    const collectFromTypes = (0, graphql_1.isObjectType)(remoteType)
        ? [remoteType, ...remoteType.getInterfaces()]
        : [remoteType];
    // Interface includes fields explicitly requested on interface type itself.
    //  It doesn't include any fields selected on it's implementations only.
    //  It is responsibility of the `compileNodeQueries` to include all the
    //  necessary interface fields.
    for (const type of collectFromTypes) {
        const fetchedFields = (_a = fetchedTypeMap.get(type.name)) !== null && _a !== void 0 ? _a : [];
        for (const { name, alias } of fetchedFields.values()) {
            collectedFields.push({
                gatsbyFieldName: alias,
                remoteFieldName: name,
                remoteFieldAlias: alias,
                remoteParentType: remoteType.name,
                gatsbyParentType: typeNameTransform.toGatsbyTypeName(remoteType.name),
            });
        }
    }
    return collectedFields;
}
function buildFieldConfig(context, fieldInfo, remoteParentType) {
    const remoteField = fieldInfo.remoteFieldName === `__typename`
        ? graphql_1.TypeNameMetaFieldDef
        : remoteParentType.getFields()[fieldInfo.remoteFieldName];
    if (!remoteField) {
        throw new Error(`Schema customization failed to find remote field ${fieldInfo.remoteParentType}.${fieldInfo.remoteFieldName}`);
    }
    const transformArgs = { remoteField, remoteParentType, fieldInfo, context };
    const fieldTransformer = field_transformers_1.fieldTransformers.find(({ test }) => test(transformArgs));
    if (fieldTransformer) {
        return fieldTransformer.transform(transformArgs);
    }
}
//# sourceMappingURL=build-fields.js.map