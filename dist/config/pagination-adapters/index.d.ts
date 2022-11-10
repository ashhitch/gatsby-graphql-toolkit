import { LimitOffset } from "./limit-offset";
import { RelayForward } from "./relay";
import { NoPagination } from "./no-pagination";
export * from "./types";
declare const PaginationAdapters: (import("./types").IPaginationAdapter<unknown[], unknown> | import("./types").IPaginationAdapter<import("./relay").IRelayPage, object>)[];
export { LimitOffset, RelayForward, NoPagination, PaginationAdapters };
