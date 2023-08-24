import type { BookItem } from "../database/databaseStructure";
import type { GenericSelection, GenericSelectionArray, GenericSelectionOperators } from "./selectionGeneric";


type Item = BookItem;

type Selection = GenericSelection<BookItem>;
type SelectionArray = GenericSelectionArray<BookItem>;
type SelectionOperators = GenericSelectionOperators<BookItem>;


export type {
    Item,
    Selection,
    SelectionArray,
    SelectionOperators,
};