import { DocumentNode } from "graphql";
import { GraphQLSource, RemoteTypeName } from "../types";
import { IDefaultFragmentsConfig } from "./generate-default-fragments";
/**
 * Utility function that tries to load fragments from given path
 * and generates default fragments when some of the fragments do not exist
 */
export declare function readOrGenerateDefaultFragments(fragmentsDir: string, config: IDefaultFragmentsConfig): Promise<Map<RemoteTypeName, GraphQLSource>>;
/**
 * Write the given fragments into a file the can be consumed by gatsby.
 *
 * @param fileName the name of javascript file to write the fragments to. can also include a path
 * @param fragmentsDoc the compiled gatsby fragments
 */
export declare function writeGatsbyFragments(fileName: string, fragmentsDoc: DocumentNode): Promise<void>;
export declare function writeCompiledQueries(outputDir: string, compiledQueries: Map<RemoteTypeName, DocumentNode>): Promise<void>;
