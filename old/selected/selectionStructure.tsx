import { BookData, Reference } from "../database/dataStructure";
import { Supplier, Consumer } from "../util";


type SelectionItem = Reference<BookData>;
type SelectionList = readonly SelectionItem[];

type SelectionObject = {
    get: Supplier<SelectionList>,
    replace: Consumer<SelectionList>,
    
    add: Consumer<SelectionItem>,
    remove: Consumer<SelectionItem>,
    set: (item: SelectionItem, value: boolean) => void,
    toggle: Consumer<SelectionItem>,

    includes: (item: SelectionItem) => boolean
}


const EMPTY_SELECTION_LIST: SelectionList = [];
const NOOP_SELECTION_OBJECT: SelectionObject = {
    get: () => EMPTY_SELECTION_LIST,
    replace: _ => undefined,

    add: _ => undefined,
    remove: _ => undefined,
    toggle: _ => undefined,
    set: (_, __) => undefined,


    includes: _ => false,
}


export type { SelectionItem, SelectionList, SelectionObject }
export { EMPTY_SELECTION_LIST, NOOP_SELECTION_OBJECT }