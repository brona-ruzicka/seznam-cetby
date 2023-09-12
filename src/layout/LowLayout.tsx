import React from "react";

import Box from "@mui/material/Box"
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import SwipeableTabs from "../component/SwipeableTabs";
import CardClickOverlay from "../component/CardClickOverlay";

import useSilentState from "../hook/useSilentState";
import { exportSpecialFragments } from "./layoutUtils";

import type { LayoutData } from "./layoutStructure";
import type { Consumer } from "../typeutil";

export default function LowLayout(props: {
    children: LayoutData,
    active: string,
    setActive: Consumer<string>,
}) {
    
    const { children: props_children, setActive: props_setActive } = props;

    const { special: { search }, rest } = React.useMemo(
        () => exportSpecialFragments(props_children, [ "search" ]),
        [ props_children ]
    );

    const [ silentIndex, silentSetIndex ] = useSilentState(0);


    let index = rest.findIndex(fragment => fragment.tag === props.active);
    if (index !== -1) {
        silentSetIndex(index, true);
    } else {
        index = silentIndex;
    }

    const setIndex = React.useCallback((index: number) => {
        silentSetIndex(index, true);
        props_setActive(rest[index].tag);
    }, [ rest, props_setActive, silentSetIndex ]);



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
                    <Grid item xs={6} lg={8} sx={{ height: "100%" }}>
                        <Card sx={{ width: "100%", height: "100%" }}>
                            <CardClickOverlay
                                onClickCapture={() => props.setActive("search")}
                            >
                                {search.component}
                            </CardClickOverlay>
                        </Card>
                    </Grid>
                    <Grid item xs={6} lg={4} sx={{ height: "100%" }}>
                        <Card sx={{ width: "100%", height: "100%" }}>
                            <CardClickOverlay
                                onClickCapture={() => props.setActive(rest[silentIndex].tag)}
                            >
                                <SwipeableTabs
                                    index={index}
                                    onChange={setIndex}
                                >
                                    {rest}
                                </SwipeableTabs>
                            </CardClickOverlay>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
