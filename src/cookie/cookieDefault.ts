import { ContextHandle } from "./cookieStructure";

export default {
    subscribe: () => { throw new Error("Requires a CookieLoader") },
    unsubscribe: () => { throw new Error("Requires a CookieLoader") },
    update: () => { throw new Error("Requires a CookieLoader") },
    values: {},
} as ContextHandle;