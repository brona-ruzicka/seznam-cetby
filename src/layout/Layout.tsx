import React from "react";

import { useTheme } from '@mui/material/styles';
import useMediaQuery from "@mui/material/useMediaQuery";


import SmallLayout from "./SmallLayout";
import MediumLayout from "./MediumLayout";
import LowLayout from "./LowLayout";
import HighLayout from "./HighLayout";

import useAutohideQueryParam from '../queryparams/useAutohideQueryParam';
import { LayoutData } from './layoutStructure';


export default function Layout(props: {
    children: LayoutData,
}) {

    const theme = useTheme();

    const small = useMediaQuery(theme.breakpoints.down("sm"));
    const medium = useMediaQuery(theme.breakpoints.down("md"));
    const high = useMediaQuery(`(min-height:${theme.spacing(100)})`);

    const LayoutClass = small ? SmallLayout : medium ? MediumLayout : high ? HighLayout : LowLayout;


    const [ active, setActive ] = useAutohideQueryParam("tab");
    const setActiveReplace = React.useCallback((tab: string) => {
        setActive(tab, true);
    }, [ setActive ]);

    return (
        <LayoutClass active={active} setActive={setActiveReplace}>
            {props.children}
        </LayoutClass>
    );

}


