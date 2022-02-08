import { Pagination } from "./pagination";

export interface PaginationWithValue<T> extends Pagination {
    value: T;
}