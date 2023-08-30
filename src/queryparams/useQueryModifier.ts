import React from "react";

import QueryParamsContext from "./QueryParamsContext";


export default function useQueryModifier() {

    const context = React.useContext(QueryParamsContext);

    const modify = React.useCallback(
        (
            modifications: Record<string, string|null>,
            replace?: boolean | undefined,
            silent?: boolean | undefined
        ) => { 
            context.update(modifications, replace, silent);
        },
        [ context ]
    )


    return modify;

}