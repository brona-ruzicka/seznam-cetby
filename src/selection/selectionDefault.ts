import type { Mutable } from "../typeutil"
import type { Selection } from "./selectionStructure";


const selection = [] as number[] as Mutable<Partial<Selection>>;

selection.add = _ => {};
selection.remove = _ => {};
selection.toggle = _ => {};
selection.includes = _ => false;

selection.set = _ => {};
selection.clear = () => {};


export default selection as Selection;
