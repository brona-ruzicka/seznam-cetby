import React from "react";

import { styled } from "@mui/material/styles";
import Chip, { ChipProps } from "@mui/material/Chip";
import Box from "@mui/material/Box";


export default function TwoPartChip(props: {
    primary?: React.ReactNode | undefined
    secondary?: React.ReactNode | undefined
} & Omit<ChipProps, "label">) {

    const { primary, secondary, ...rest } = props;

    return (
        <StyledChip
            label={(
                <>
                    { primary }
                    <Box
                        sx={{
                            minWidth: "1px",
                            alignSelf: "stretch",
                            background: theme => theme.palette.mode === 'light'
                                ? theme.palette.grey[400]
                                : theme.palette.grey[700],
                            marginRight: props.size === "small" ? 0.75 : 1,
                            marginLeft: props.size === "small" ? 0.75 : 1,
                        }}
                    />
                    { secondary }
                </>
            )}
            {...rest}
        /> 
    );

}


const StyledChip = styled(Chip)(({theme}) => ({
    "& > .MuiChip-label": {
        height: "100%",
        display: "inline-flex",
        alignItems: "center",
        minWidth: "fit-content",
    }
}))







