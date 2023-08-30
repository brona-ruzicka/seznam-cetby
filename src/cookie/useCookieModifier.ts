import React from "react";

import CookieContext from "./CookieContext";

import type { CookieAttributes } from "js-cookie";


export default function useCookieModifier() {

    const context = React.useContext(CookieContext);

    const modify = React.useCallback(
        (
            modifications: Record<string, string|null>,
            attributes?: CookieAttributes | undefined,
            silent?: boolean | undefined
        ) => { 
            context.update(modifications, attributes, silent);
        },
        [ context ]
    )


    return modify;

}