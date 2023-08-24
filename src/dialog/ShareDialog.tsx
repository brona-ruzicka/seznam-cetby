import React from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import Close from "@mui/icons-material/Close";
import ContentCopy from "@mui/icons-material/ContentCopy";


import useGlobalStateValue from "../globalstate/useGlobalStateValue";
import useSelection from "../selection/useSelection";

import { generateShareUrl } from "../hook/useShare";
import QRCode from "react-qr-code";



export default function ShareDialog() {
    
    const [ share, setShare ] = useGlobalStateValue("share");

    const isOpen = !!share;
    const close = React.useCallback(() => setShare(null), [ setShare ]);

    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Dialog open={isOpen} onClose={close} fullScreen={small}>
            <MyDialogContent onClose={close} fullScreen={small}/>
        </Dialog>
    )

}


const MyDialogContent = (props: {
    onClose: () => void,
    fullScreen: boolean,
}) => {

    const theme = useTheme();

    const selection = useSelection();
    const shareUrl = generateShareUrl(selection)

    const canCopy = !!(navigator.clipboard && navigator.clipboard.writeText);
    const copy = React.useCallback(() => {
        navigator.clipboard.writeText(shareUrl);
    }, [ shareUrl ]);

    return (
        <>
            <DialogTitle sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <span>Sdílet</span>
                <IconButton
                    sx={{ marginRight: -1 }}
                    disableTouchRipple
                    onClick={props.onClose}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{
                width: props.fullScreen ? undefined : (theme => theme.spacing(64))
            }}
            
            >
                <Stack
                    spacing={3}
                    sx={{
                        alignItems: "center",
                        paddingTop: 1,
                        justifyContent: props.fullScreen ? "center" : undefined,
                        height: props.fullScreen ? "100%" : undefined
                    }}
                >
                    <Box
                        sx={{
                            padding: 4,                            
                            boxSizing: props.fullScreen ? "border-box" : "content-box",
                            width: props.fullScreen ? "100%" : "256px",
                            aspectRatio: "1 / 1",

                            backgroundColor: theme => theme.palette.mode === "light"
                            ? theme.palette.background.default
                            : theme.palette.common.white,
                            borderRadius: theme => theme.shape.borderRadius,

                            pointerEvents: "none"

                        }}
                        
                    >
                        <QRCode
                            value={shareUrl}
                            bgColor="transparent"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                            size={256}
                        />
                    </Box>
                    <Box sx={{
                        position: "relative",
                        width: "100%",

                        borderStyle: "solid",
                        borderRadius: theme => theme.spacing(1/2),
                        borderWidth: 1,
                        borderColor: theme => theme.palette.mode === 'light'
                        ? theme.palette.grey[400]
                        : theme.palette.grey[700],
                    }}>
                        <input
                                style={{
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                    padding: theme.spacing(2),
                                    paddingRight: canCopy ? theme.spacing(6) : undefined,
                                    margin: 0,

                                    fontSize: "inherit",
                                    lineHeight: "inherit",
                                    color: "inherit",
                                    width: "100%",
                                }}
                                value={shareUrl}
                                disabled
                            />
                        { canCopy && (
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    right: 0,
                                    transform: "translateY(-50%)"
                                }}
                                onClick={copy}   
                            >
                                <ContentCopy />
                            </IconButton>
                        )}
                    </Box>
                </Stack>
            </DialogContent>
        </>
    );

}