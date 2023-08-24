import React from "react";

import Alert, { AlertProps } from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";


export default function CollapseAlert(props: {
    in?: boolean | undefined,
    title?: React.ReactNode | undefined,
} & Omit<AlertProps, "title">) {

    const { in: isIn, title, children, ...rest } = props;

    return (
        <Alert {...rest} >
            <AlertTitle sx={{
                transition: theme => theme.transitions.create(["margin-top", "margin-bottom"]),
                ...(!isIn ? { marginBottom: -1/4, marginTop: 0 } : { })
            }}>
                { title }
            </AlertTitle>
            <Collapse in={isIn}>
                { children }
            </Collapse>
        </Alert>
    )

}