import { ContextHandle } from "./queryParamsStructure";

export default {
    subscribe: () => { throw new Error("Requires a QueryParamsLoader") },
    unsubscribe: () => { throw new Error("Requires a QueryParamsLoader") },
    update: () => { throw new Error("Requires a QueryParamsLoader") },
    values: {},
} as ContextHandle;