import React from "react";

import QueryParamsContext from "./QueryParamsContext";


export default function useQueryParam(name: string) {


    const context = React.useContext(QueryParamsContext);


    const [ , setBlank ] = React.useState({});

    React.useEffect(() => {
        const handle = { names: [ name ], notify: () => setBlank({}) };
        context.subscribe(handle);
        return () => context.unsubscribe(handle);
    }, [ name, context, setBlank ]);


    const setter = React.useCallback((
        query: string|null | ((prev: string|null) => string|null),
        replace?: boolean | undefined,
        silent?: boolean | undefined
    ) => {
        context.update({
            [name]: typeof query === "function"
                ? query(context.values[name])
                : query
        }, replace, silent);
    }, [ name, context ]);


    return [ context.values[name], setter ] as const;

}