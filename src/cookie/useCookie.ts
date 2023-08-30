import React from "react";

import CookieContext from "./CookieContext";

import type { CookieAttributes } from "js-cookie";


export default function useCookie(name: string) {


    const context = React.useContext(CookieContext);


    const [ , setBlank ] = React.useState({});

    React.useEffect(() => {
        const handle = { names: [ name ], notify: () => setBlank({}) };
        context.subscribe(handle);
        return () => context.unsubscribe(handle);
    }, [ name, context, setBlank ]);


    const setter = React.useCallback((
        query: string|null | ((prev: string|null) => string|null),
        attributes?: CookieAttributes | undefined,
        silent?: boolean | undefined
    ) => {
        context.update({
            [name]: typeof query === "function"
                ? query(context.values[name])
                : query
        }, attributes, silent);
    }, [ name, context ]);


    return [ context.values[name], setter ] as const;

}