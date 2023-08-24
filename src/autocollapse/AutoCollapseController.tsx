import React from "react";

import AutoCollapseContext from "./AutoCollapseContext";

export default function AutoCollapseController(props: {
    children?: React.ReactNode | undefined,
    collapsed: boolean,
}) {

    return (
        <AutoCollapseContext.Provider
            value={props.collapsed}
        >
            {props.children}
        </AutoCollapseContext.Provider>
    );
    
}