import { DocumentNode, GraphQLSchema } from "graphql";
import { GraphQLSource, IGatsbyFieldAliases, IGatsbyNodeConfig, ITypeNameTransform, RemoteTypeName } from "../types";
interface ICompileGatsbyFragmentsArgs {
    schema: GraphQLSchema;
    gatsbyNodeTypes: IGatsbyNodeConfig[];
    gatsbyTypePrefix: string;
    gatsbyFieldAliases?: IGatsbyFieldAliases;
    typeNameTransform?: ITypeNameTransform;
    customFragments: Array<GraphQLSource | string> | Map<RemoteTypeName, GraphQLSource | string>;
}
/**
 * Takes a list of custom source fragments and transforms them to
 * a list of gatsby fragments.
 *
 * E.g.
 * fragment PostAuthor on Author {
 *   id
 *   name
 *   allPosts {
 *     excerpt: description(truncateAt: 200)
 *   }
 * }
 *
 * is compiled to the following Gatsby fragment:
 *
 * fragment PostAuthor on MyAuthor {
 *   id
 *   name
 *   allPosts {
 *     excerpt
 *   }
 * }
 */
export declare function compileGatsbyFragments(args: ICompileGatsbyFragmentsArgs): DocumentNode;
export {};
