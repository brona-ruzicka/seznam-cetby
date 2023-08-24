import type { Reference } from "../database/dataStructure";
import type { AuthorItem, CategoryItem } from "../database/databaseStructure";
import { ReadonlyRecord } from "../typeutil";

type Counts = Readonly<{
    total: number,
    authors: ReadonlyRecord<Reference<AuthorItem>, number>,
    categories: ReadonlyRecord<Reference<CategoryItem>, number>,
}>;

export type {
    Counts,
};