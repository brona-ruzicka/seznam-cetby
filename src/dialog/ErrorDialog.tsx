import React from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import useGlobalStateValue from "../globalstate/useGlobalStateValue";


export default function ErrorDialog() {

    const [ error ] = useGlobalStateValue("error");
    const isOpen = !!error;
    
    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Dialog open={isOpen} fullScreen={small}>
            <DialogTitle sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <span>Aplikaci se nepodařilo načíst potřebná data.</span>
            </DialogTitle>
            <DialogContent>
                {"Ujistěte se, že jste připojeni k internetu, a načtěte stánku znovu. Pokud problém přetrvává, kontaktujte administrátota."}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    sx={small ? { flex: 1, padding: 1.5, margin: 1 } : undefined}
                    color="primary"
                    onClick={() => window.location.reload()}
                >
                    Načíst znovu
                </Button>
            </DialogActions>
        </Dialog>
    )

}
