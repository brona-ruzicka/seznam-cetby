import React from "react";

import GlobalStateContext from "./GlobalStateContext";


export default function useGlobalStateModifier() {

    const context = React.useContext(GlobalStateContext);

    const modify = React.useCallback(
        (
            modifications: Record<string, string|null>,
            silent?: boolean | undefined,
        ) => { 
            context.update(modifications, silent);
        },
        [ context ]
    )


    return modify;

}