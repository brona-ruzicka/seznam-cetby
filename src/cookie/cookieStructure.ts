import { CookieAttributes } from "js-cookie";
import { ReadonlyRecord } from "../typeutil";


type SubscriberHandle = {
    names: string[] | "all",
    notify: () => void,
};

type ContextHandle = Readonly<{
    subscribe: (handle: SubscriberHandle) => void,
    unsubscribe: (handle: SubscriberHandle) => void,
    update: (updates: ReadonlyRecord<string, string|null>, attributes?: CookieAttributes | undefined) => void,
    values: ReadonlyRecord<string, string|null>
}>;


export type {
    SubscriberHandle,
    ContextHandle,
}