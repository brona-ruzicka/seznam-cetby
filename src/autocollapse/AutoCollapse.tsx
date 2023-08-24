import React from "react";

import Collapse, { CollapseProps } from "@mui/material/Collapse";

import useAutoCollapse from "./useAutoCollapse";


export default function AutoCollapse(props: Omit<CollapseProps, "in">) {

    const collapsed = useAutoCollapse();

    return (
        <Collapse
            in={!collapsed}
            {...props}
        />
    );

}