import React from "react";

import List, { ListProps } from "@mui/material/List";
import Collapse from "@mui/material/Collapse";

import TransitionGroup from "react-transition-group/TransitionGroup";


export default function AnimatedList(props: 
    {
        children?: { key: React.Key, component?: React.ReactNode | undefined }[] | undefined
    } 
    & Omit<ListProps, "children">
) {

    const { children, ...rest } = props;

    return (
        <List { ...rest }>
            <TransitionGroup>
                {
                    children?.map(({key, component}) => (
                        <Collapse key={key}>
                            {component}
                        </Collapse>
                    ))                    
                }
            </TransitionGroup>
        </List>
    );
    
}