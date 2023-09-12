import React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";

import SwipeableTabs from "../component/SwipeableTabs";
import type { LayoutData } from "./layoutStructure";
import type { Consumer } from "../typeutil";

export default function MediumLayout(props: {
    children: LayoutData,
    active: string,
    setActive: Consumer<string>,
}) {

    let index = props.children.findIndex(fragment => fragment.tag === props.active);
    if (index === -1) {
        index = 0;
    }

    const { children: props_children, setActive: props_setActive } = props;
    const setIndex = React.useCallback((index: number) => {
        props_setActive(props_children[index].tag);
    }, [ props_children, props_setActive ]);

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                height: "100%",
                padding: 2,

                backgroundColor: theme => theme.palette.background.default,
            }}
        >
            <Container
                maxWidth="lg"
                sx={{ height: "100%" }}
            >
                <Card sx={{ width: "100%", height: "100%" }}>
                    <SwipeableTabs
                        index={index}
                        onChange={setIndex}
                    >
                        {props.children}
                    </SwipeableTabs>
                </Card>
            </Container>
        </Box>
    );

}