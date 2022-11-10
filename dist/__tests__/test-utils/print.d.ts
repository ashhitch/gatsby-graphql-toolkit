import { DocumentNode } from "graphql";
import { RemoteTypeName } from "../../types";
export declare function printQuery(compiledQueries: Map<RemoteTypeName, DocumentNode>, remoteTypeName: string): string;
declare type FragmentName = string;
export declare function printFragment(document: DocumentNode, fragmentName: FragmentName): string;
export declare function dedent(gqlStrings: TemplateStringsArray): string;
export {};
