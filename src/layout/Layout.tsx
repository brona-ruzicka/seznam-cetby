import React from "react";

import { useTheme } from '@mui/material/styles';
import useMediaQuery from "@mui/material/useMediaQuery";


import SmallLayout from "./SmallLayout";
import LowLayout from "./LowLayout";
import HighLayout from "./HighLayout";

import useAutohideQueryParam from '../queryparams/useAutohideQueryParam';
import { LayoutData } from './layoutStructure';


export default function Layout(props: {
    children: LayoutData,
}) {

    const theme = useTheme();

    const small = useMediaQuery(theme.breakpoints.down("sm"));
    const high = useMediaQuery(`(min-height:${theme.spacing(100)})`);

    const LayoutClass = small ? SmallLayout : high ? HighLayout : LowLayout;


    const [ active, setActive ] = useAutohideQueryParam("tab");
    const setActiveReplace = React.useCallback((tab: string) => {
        console.log("LAYOUT", tab)
        debugger;
        setActive(tab, true);
    }, [ setActive ]);

    return (
        <LayoutClass active={active} setActive={setActiveReplace}>
            {props.children}
        </LayoutClass>
    );

}


