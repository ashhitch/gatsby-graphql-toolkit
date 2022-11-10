import { IPaginationAdapter } from "./types";
export interface IRelayPage {
    edges: {
        cursor: string;
        node: object | null;
    }[];
    pageInfo: {
        hasNextPage: boolean;
    };
}
export declare const RelayForward: IPaginationAdapter<IRelayPage, object>;
