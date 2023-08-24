import React from "react";
import CookieContext from "./CookieContext";

import type { SubscriberHandle } from "./cookieStructure";

import Cookies, { CookieAttributes } from "js-cookie";


const DEFAULT_DOMAIN = window.location.hostname;
const DEFAULT_PATH = process.env.PUBLIC_URL;
const DEFAULT_EXPIRES = 4 * 365;


export default function CookieLoader(props: {
    children?: React.ReactNode | undefined,
}) {

    const handle = React.useMemo(() => {

        
        const values = new Proxy({} as Record<string, string | null>, {
            get: (target, name) => {
                if (typeof name !== "string")
                    return undefined;

                const stored = target[name]
                if (stored !== undefined)
                    return stored;

                const value = Cookies.get(name) ?? null;
                target[name] = value;
                return value;
            }
        });
        
        const subscribers = new Set<SubscriberHandle>();

        const update = (updates: Record<string, string|null>, attributes?: CookieAttributes | undefined) => {

            const changes = Object.entries(updates)
                .filter(([key, value]) => values[key] !== value);

            changes.forEach(([key, value]) => {
                values[key] = value;
                if (value === null) {
                    Cookies.remove(key, { domain: DEFAULT_DOMAIN, path: DEFAULT_PATH, ...attributes });
                } else {
                    Cookies.set(key, value, { domain: DEFAULT_DOMAIN, path: DEFAULT_PATH, expires: DEFAULT_EXPIRES, ...attributes });
                }
            });

            setTimeout(() => {
                const keys = changes.map(([key,]) => key);
                Array.from(subscribers.values())
                    .filter(({names}) => names === "all" || names.some(name => keys.includes(name)))
                    .forEach(({notify}) => notify());
            }, 0);
        }

        return {
            subscribe: (handle: SubscriberHandle) => subscribers.add(handle),
            unsubscribe: (handle: SubscriberHandle) => subscribers.delete(handle),
            update: update,
            values: values,
        }

    }, [ ]);

    return (
        <CookieContext.Provider value={handle}>
            {props.children}
        </CookieContext.Provider>
    )

}