import React from "react";

import GlobalStateContext from "./GlobalStateContext";


export default function useGlobalStateValue(name: string) {


    const context = React.useContext(GlobalStateContext);


    const [ , setBlank ] = React.useState({});

    React.useEffect(() => {
        const handle = { names: [ name ], notify: () => setBlank({}) };
        context.subscribe(handle);
        return () => context.unsubscribe(handle);
    }, [ name, context, setBlank ]);


    const setter = React.useCallback((
        query: string|null | ((prev: string|null) => string|null)
    ) => {
        context.update({
            [name]: typeof query === "function"
                ? query(context.values[name])
                : query
        });
    }, [ name, context ]);


    return [ context.values[name], setter ] as const;

}