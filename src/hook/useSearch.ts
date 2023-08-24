import React from "react";
import useQueryModifier from "../queryparams/useQueryModifier";

export default function useSearch() {

    const modify = useQueryModifier();

    const setter = React.useCallback((query: string) => {
        modify({ tab: "search", search: query });
    }, [ modify ])

    return setter;

}