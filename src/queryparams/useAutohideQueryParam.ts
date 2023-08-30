import React from "react";

import useQueryParam from "./useQueryParam";


export default function useAutohideQueryParam(name: string) {

    const [ query, setQuery ] = useQueryParam(name);

    const setAutohideQuery = React.useCallback((
        query: string | ((prev: string) => string),
        replace?: boolean | undefined,
        silent?: boolean | undefined
    ) => setQuery(
        typeof query === "function"
            ? (prev) => (query(prev ?? "") || null)
            : (query || null), 
        replace, silent
    ), [ setQuery ] );

    return [ query ?? "", setAutohideQuery ] as const;

}