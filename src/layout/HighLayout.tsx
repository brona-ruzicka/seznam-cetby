import React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card"

import SwipeableTabs from "../component/SwipeableTabs";
import CardClickOverlay from "../component/CardClickOverlay";
import AutoCollapseController from "../autocollapse/AutoCollapseController";

import useSilentState from "../hook/useSilentState";
import { exportSpecialFragments } from "./layoutUtils";

import type { LayoutData } from "./layoutStructure";
import type { Consumer } from "../typeutil";


export default function HighLayout(props: {
    children: LayoutData,
    active: string,
    setActive: Consumer<string>,
}) {

    const { special: { search, overview }, rest } = React.useMemo(
        () => exportSpecialFragments(props.children, ["search", "overview"]),
        [ props.children ]
    );


    const [ silentIndex, silentSetIndex ] = useSilentState(0);
    const [ silentCollapsed, silentSetCollapsed ] = useSilentState(false);


    let index = rest.findIndex(fragment => fragment.tag === props.active);
    let collapsed = silentCollapsed;

    if (index !== -1) {
        silentSetIndex(index, true);
        silentSetCollapsed(true, true);
        collapsed = true;
    } else {
        if (props.active === "overview") {
            silentSetCollapsed(false, true);
            collapsed = false;
        }
        index = silentIndex;
    }

    
    const setIndex = React.useCallback((index: number) => {
        silentSetIndex(index, true);
        props.setActive(rest[index].tag);
    }, [ rest, props.setActive ]);

    const setCollapsed = React.useCallback((collapsed: boolean) => {
        silentSetCollapsed(collapsed, true);
        if (collapsed)
            props.setActive(rest[index].tag);
        else
            props.setActive("overview");
    }, [ rest, props.setActive ]);
    

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
                <Grid container spacing={2} sx={{ height: "100%" }}>
                    <Grid item xs={6} md={8} sx={{ height: "100%" }}>
                        <Card sx={{ width: "100%", height: "100%" }}>
                            <CardClickOverlay
                                onClickCapture={() => props.setActive("search")}
                            >
                                {search?.component}
                            </CardClickOverlay>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{ height: "100%" }}>
                        <Stack spacing={2} sx={{ height: "100%" }}>
                            <Card sx={{ width: "100%", minHeight: (theme) => theme.spacing(20), flex: 1 }}>
                                <CardClickOverlay
                                    visible={!collapsed}
                                    onClickCapture={() => setCollapsed(true)}
                                >
                                    <SwipeableTabs
                                        index={index}
                                        onChange={setIndex}
                                    >
                                        {rest}
                                    </SwipeableTabs>
                                </CardClickOverlay>
                            </Card>
                            <Card sx={{ width: "100%" }}>
                                <CardClickOverlay
                                    visible={collapsed}
                                    onClickCapture={() => setCollapsed(false)}
                                >
                                    <AutoCollapseController collapsed={collapsed}>
                                        {overview?.component}
                                    </AutoCollapseController>
                                </CardClickOverlay>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
