import React from "react";


import { styled } from "@mui/material/styles";
import CardActionArea, { CardActionAreaProps } from "@mui/material/CardActionArea";


export default function CardClickOverlay(props: {
    visible?: boolean | undefined
} & Omit<CardActionAreaProps, "disableRipple" | "disabled">) {

    const { children, visible, ...rest } = props;

    return (
        <StyledCardActionArea
            component="div"
            disableRipple
            disabled={!visible}
            { ...rest }
        >
            {props.children}
        </StyledCardActionArea>
    );
}

const StyledCardActionArea = styled(CardActionArea)<CardActionAreaProps & { component: string }>({
    "&": {
        display: "block",
        height: "100%"
    },
    "&.Mui-disabled": {
        pointerEvents: "initial"
    },
    "&.Mui-disabled:hover > .MuiCardActionArea-focusHighlight": {
        opacity: 0
    }
});
