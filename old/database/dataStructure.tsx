import type { Nullable } from "../util";


type Reference<T extends { id: unknown }> = T["id"];

type BookData = Readonly<{
    id: number,
    name: string,
    note: Nullable<string>,
    published: number,

    authors: Nullable<readonly Reference<AuthorData>[]>,
    categories: Nullable<readonly Reference<CategoryData>[]>,
}>;

type AuthorData = Readonly<{
    id: number,
    short: Nullable<string>,
    name: string,
    born: number,
}>;

type CategoryData = Readonly<{
    id: number,
    short: Nullable<string>,
    name: string,    
}>;

type Data = Readonly<{
    books: readonly BookData[],
    authors: readonly AuthorData[],
    ategories: readonly CategoryData[],
}>;


export type { Reference, BookData, AuthorData, CategoryData, Data };