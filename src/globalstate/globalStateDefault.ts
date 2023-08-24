import { ContextHandle } from "./globalStateStructure";

export default {
    subscribe: () => { throw new Error("Requires a GlobalStateLoader") },
    unsubscribe: () => { throw new Error("Requires a GlobalStateLoader") },
    update: () => { throw new Error("Requires a GlobalStateLoader") },
    values: {},
} as ContextHandle;