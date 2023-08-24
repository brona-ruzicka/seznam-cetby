
import type { Nullable, ReadonlyRecord } from "../typeutil";
import type { CategoryKind, LimitData as LimitItem, Extra as DatabaseExtra } from "./dataStructure";


type BookItem = Readonly<{
    id: number,
    name: string,
    note: Nullable<string>,
    published: number,
    
    authors: ReadonlyArray<AuthorItem>,
    categories: ReadonlyArray<CategoryItem>,
}>;

type AuthorItem = Readonly<{
    id: number,
    short: string,
    name: string,
    aliases: string[]
    born: number,

    books: ReadonlyArray<BookItem>,
    categories: ReadonlyArray<CategoryItem>,
}>;

type CategoryItem = Readonly<{
    id: number,
    short: string,
    name: string,
    kind: CategoryKind,
    limit: LimitItem

    books: ReadonlyArray<BookItem>,
    authors: ReadonlyArray<AuthorItem>,
}>;



type EmptyDatabase = {
    loaded: false,
    books: {},
    authors: {},
    categories: {},
    extra: {},
};

type LoadedDatabase = {
    loaded: true,
    books: ReadonlyRecord<number, BookItem>,
    authors: ReadonlyRecord<number, AuthorItem>,
    categories: ReadonlyRecord<number, CategoryItem>,
    extra: DatabaseExtra,
};

type Database = EmptyDatabase | LoadedDatabase;


export type {
    Database,
    EmptyDatabase,
    LoadedDatabase,
    DatabaseExtra,
    BookItem,
    AuthorItem,
    CategoryItem,
    LimitItem,
};
