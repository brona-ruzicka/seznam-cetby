
import type { Nullable } from "../util";

const EMPTY_DATABASE_TEMPLATE = {
    loaded: false, 
    books: {},
    authors: {},
    categories: {},
};


type WriteableBookItem = {
    readonly id: number,
    readonly name: string,
    readonly note: Nullable<string>,
    readonly published: number,
    
    readonly authors: readonly AuthorItem[],
    readonly categories: readonly CategoryItem[],
}

type WriteableAuthorItem = {
    id: number,
    short: string,
    name: string,
    born: number,

    books: readonly BookItem[],
    categories: readonly CategoryItem[],
}


type WriteableCategoryItem = {
    readonly id: number,
    readonly short: string,
    readonly name: string,

    readonly books: readonly BookItem[],
    readonly authors: readonly AuthorItem[],
}

type BookItem = Readonly<WriteableBookItem>;
type AuthorItem = Readonly<WriteableAuthorItem>;
type CategoryItem = Readonly<WriteableCategoryItem>;

type Database = {
    loaded: boolean,
    books: Readonly<Record<number, BookItem>>,
    authors: Readonly<Record<number, AuthorItem>>,
    categories: Readonly<Record<number, CategoryItem>>,
}







const EMPTY_DATABASE: Database = EMPTY_DATABASE_TEMPLATE;


export type { Database, BookItem, AuthorItem, CategoryItem, WriteableBookItem, WriteableAuthorItem, WriteableCategoryItem };
export { EMPTY_DATABASE };