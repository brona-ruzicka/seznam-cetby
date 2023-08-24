import type { Nullable } from "../typeutil";

type Referable<I extends number | string> = { id: I }
type Reference<R> = R extends Referable<infer I> ? I : never;

type BookData = Readonly<{
    id: number,
    name: string,
    note: Nullable<string>,
    published: number,

    authors: Nullable<ReadonlyArray<Reference<AuthorData>>>,
    categories: Nullable<ReadonlyArray<Reference<CategoryData>>>,
}>;

type AuthorData = Readonly<{
    id: number,
    short: Nullable<string>,
    name: string,
    aliases: Nullable<string[]>
    born: number,
}>;

type CategoryKind = "form" | "era"
type CategoryData = Readonly<{
    id: number,
    short: Nullable<string>,
    name: string,
    kind: CategoryKind,
    limit: LimitData
}>;

type LimitData = Readonly<{
    max?: number,
    min?: number,
}>;

type Extra = Readonly<{
    authorLimit: LimitData
    bookLimit: LimitData
}>

type Data = Readonly<{
    books: ReadonlyArray<BookData>,
    authors: ReadonlyArray<AuthorData>,
    categories: ReadonlyArray<CategoryData>,
    extra: Extra
}>;


export type {
    Referable,
    Reference,
    BookData,
    AuthorData,
    CategoryKind,
    CategoryData,
    LimitData,
    Extra,
    Data,
};