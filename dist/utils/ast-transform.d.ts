import { NamedTypeNode } from "graphql";
export declare function renameNode<T extends NamedTypeNode>(node: T, convertName: (name: string) => string): T;
