import React from "react";
import QueryParamsContext from "./QueryParamsContext";

import type { SubscriberHandle } from "./queryParamsStructure";

export default function QueryParamsLoader(props: {
    children?: React.ReactNode | undefined,
}) {

    const { handle, listener } = React.useMemo(() => {

        
        const search = new URLSearchParams(window.location.search);
        const raw = Array.from(search.entries())
            .reduce((reducer, [key, value]) => {
                reducer[key] = reducer[key] || (value ?? null);
                return reducer;
            }, {} as Record<string, string|null>);

        const values = new Proxy(raw, {
            get: (target, name) => {
                if (typeof name !== "string")
                    return undefined;  
                return target[name] ?? null;
            }
        });

        const subscribers = new Set<SubscriberHandle>();


        const change = (changes: [ string, string|null][], silent?: boolean|undefined) => {
            
            changes.forEach(([key, value]) => {
                values[key] = value;

                if (value === null) {
                    search.delete(key);
                } else {
                    search.set(key, value);
                }
            });

            if (silent) return;

            setTimeout(() => {
                const keys = changes.map(([key,]) => key);
                Array.from(subscribers.values())
                    .filter(({names}) => names === "all" || names.some(name => keys.includes(name)))
                    .forEach(({notify}) => notify());
            }, 0);

        }

        const update = (updates: Record<string, string|null>, replace?: boolean|undefined, silent?: boolean|undefined) => {

            const changes = Object.entries(updates)
                .filter(([key, value]) => values[key] !== value);

            change(changes, silent);

            const url = new URL(window.location.href);
            url.search = search.toString();

            if (replace) {
                window.history.replaceState({}, "", url.toString());
            } else {
                window.history.pushState({}, "", url.toString());
            }
        }
        
        const listener = () => {

            if (search.toString() === window.location.search)
                return;


            const newValues = Array.from(new URLSearchParams(window.location.search).entries())
                .reduce((reducer, [key, value]) => {
                    reducer[key] = reducer[key] || value;
                    return reducer;
                }, {} as Record<string, string|null>);

            const changes = [
                ...Object.entries(newValues)
                    .filter(([key,]) => newValues[key] !== values[key]),
                ...Object.keys(values)
                    .filter(key => newValues[key] === undefined)
                    .map(key => [ key, null ] as [ string, string|null ])
            ];

            change(changes);
            
        }


        return {
            handle: {
                subscribe: (handle: SubscriberHandle) => subscribers.add(handle),
                unsubscribe: (handle: SubscriberHandle) => subscribers.delete(handle),
                update: update,
                values: values,
            },
            listener: listener
        }

    }, [ ]);

    React.useEffect(() => {
        window.addEventListener("popstate", listener);
        return () => window.removeEventListener("popstate", listener);
    }, [ listener ]);

    return (
        <QueryParamsContext.Provider value={handle}>
            {props.children}
        </QueryParamsContext.Provider>
    )

}
