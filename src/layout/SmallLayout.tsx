import React from "react";

import Box from "@mui/material/Box";

import SwipeableTabs from "../component/SwipeableTabs";

import type { LayoutData } from "./layoutStructure";
import type { Consumer } from "../typeutil";

export default function SmallLayout(props: {
    children: LayoutData,
    active: string,
    setActive: Consumer<string>,
}) {

    let index = props.children.findIndex(fragment => fragment.tag === props.active);
    if (index === -1) {
        index = 0;
    }

    const setIndex = (index: number) => {
        props.setActive(props.children[index].tag);
    };


    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                height: "100%",
                
                backgroundColor: theme => theme.palette.background.paper,
            }}
        >
            <SwipeableTabs
                index={index}
                onChange={setIndex}
            >
                {props.children}
            </SwipeableTabs>
        </Box>
    );
}