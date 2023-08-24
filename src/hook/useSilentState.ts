import React from "react";

export default function useSilentState<T>(init: T) {

    const ref = React.useRef(init);

    const [ , setBlank ] = React.useState({});

    const setter = React.useCallback((
        value: T,
        silent?: boolean|undefined
    ) => {
        ref.current = value;

        if (!silent)
            setBlank({});

    }, [ ref, setBlank ]);

    return [ ref.current, setter ] as const;

}