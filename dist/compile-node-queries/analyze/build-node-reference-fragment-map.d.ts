import { GraphQLSchema } from "graphql";
import { FragmentMap, IGatsbyNodeConfig } from "../../types";
/**
 * Create reference fragment for every node type
 * and put it to a Map<TypeName, FragmentDefinitionNode>.
 *
 * "Reference fragment" is a fragment that contains all necessary fields
 * required to find the actual node in gatsby store (i.e. type, id).
 *
 * For example:
 *
 * fragment NodeTypeReference on NodeType {
 *   __typename
 *   id
 * }
 *
 * Resulting map also includes fragments for node interfaces.
 * "Node interface" is an interface having only node types as it's implementors
 *
 * (if there is at least one non-node type then an interface
 * can not be considered a "node interface")
 */
export declare function buildNodeReferenceFragmentMap({ schema, gatsbyNodeTypes: nodes, }: {
    schema: GraphQLSchema;
    gatsbyNodeTypes: IGatsbyNodeConfig[];
}): FragmentMap;
