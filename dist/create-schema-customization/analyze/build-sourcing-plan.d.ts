import { GraphQLSchema } from "graphql";
import { IGatsbyNodeDefinition, ISourcingPlan, RemoteTypeName } from "../../types";
interface IBuildSourcingPlanArgs {
    schema: GraphQLSchema;
    gatsbyNodeDefs: Map<RemoteTypeName, IGatsbyNodeDefinition>;
}
export declare function buildSourcingPlan(args: IBuildSourcingPlanArgs): ISourcingPlan;
export {};
