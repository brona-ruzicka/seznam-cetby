
import type { Referable } from "../database/dataStructure";


type GenericSelectionArray<R> = R extends Referable<infer I> ? Omit<ReadonlyArray<I>, "includes"> : never;

type GenericSelectionOperators<R> = R extends Referable<infer I> ? Readonly<{

    add: (...items: (R|I)[]) => void,
    remove: (...items: (R|I)[]) => void,
    toggle: (...items: (R|I)[]) => void,

    includes: (...items: (R|I)[]) => boolean

    set: (...items: (R|I)[]) => void,
    clear: () => void,

}> : never;

type GenericSelection<R> = GenericSelectionArray<R> & GenericSelectionOperators<R>;


export type {
    GenericSelection,
    GenericSelectionArray,
    GenericSelectionOperators,
};

