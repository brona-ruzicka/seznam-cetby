import React from "react";
import GlobalStateContext from "./GlobalStateContext";

import type { SubscriberHandle } from "./globalStateStructure";


export default function GlobalStateLoader(props: {
    children?: React.ReactNode | undefined,
}) {

    const handle = React.useMemo(() => {

        const values = new Proxy({} as Record<string, string|null>, {
            get: (target, name) => {
                if (typeof name !== "string")
                    return undefined;  
                return target[name] ?? null;
            }
        });

        const subscribers = new Set<SubscriberHandle>();

        const update = (updates: Record<string, string|null>, silent?: boolean|undefined) => {

            const changes = Object.entries(updates)
                .filter(([key, value]) => values[key] !== value);

            changes.forEach(([key, value]) => {
                values[key] = value;
            });

            if (silent) return;

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
        <GlobalStateContext.Provider value={handle}>
            {props.children}
        </GlobalStateContext.Provider>
    )

}
