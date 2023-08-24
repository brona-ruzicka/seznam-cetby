import React from "react";

import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import SwipeableViews from "react-swipeable-views-react-18-fix";


export type TabData = {
    label: string,
    component: React.ReactNode
};

export default function SwipeableTabs(props: {
    children: TabData[]
    index: number,
    onChange: (newIndex: number) => void
}) {

    return (
        <Stack sx={{ height: "100%" }}>
            <StyledTabs 
                value={props.index}
                onChange={(_, newIndex) => props.onChange(newIndex)}
                variant="scrollable"
                allowScrollButtonsMobile
            >
                {
                    props.children.map((entry, index) => (
                        <Tab
                            key={entry.label}
                            value={index}
                            label={entry.label}
                            sx={{ flex: 1, minWidth: "fit-content" }}
                        />
                    ))
                }
            </StyledTabs>
            <SwipeableViews
                index={props.index}
                onChangeIndex={props.onChange}
                style={{ flex: 1, minHeight: 0 }}
                containerStyle={{ height: "100%", willChange: "unset" }}
                 
            >
                {
                    props.children.map((entry) => (
                        <Box
                            key={entry.label}
                            sx={{ height: "100%" }}>
                            { entry.component }
                        </Box>
                    ))
                }
            </SwipeableViews>
        </Stack>
    );
}

const StyledTabs = styled(Tabs)(({theme}) => ({
    "&": {
        position: "relative"
    },
    "&::before": {
        content: '""',

        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,

        borderBottom: "1px solid",
        borderBottomColor: theme.palette.divider
    },
    "& > .MuiTabs-scroller:last-child": {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    "& > .MuiTabs-scroller > .MuiTabs-flexContainer > .MuiTab-root": {
        paddingTop: theme.spacing(3.5),
        height: theme.spacing(8)
    }
}));
