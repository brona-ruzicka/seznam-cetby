import React from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import Close from "@mui/icons-material/Close";


import useQueryParam from "../queryparams/useQueryParam";
import useCookieModifier from "../cookie/useCookieModifier";
import useGlobalStateValue from "../globalstate/useGlobalStateValue";


export default function OpeningSharedListDialog() {

    const [ selectionQuery, setSelectionQuery ] = useQueryParam("s");
    const modifyCookie = useCookieModifier();

    const [ closed, setClosed ] = useGlobalStateValue("share_alert");
    const isOpen = selectionQuery !== null && closed !== "closed";

    const close = React.useCallback(() => {
        setClosed("closed");
    }, [ setClosed ]);
    const save = React.useCallback(() => {
        modifyCookie({ selection: selectionQuery });
        setSelectionQuery(null);
    }, [ modifyCookie, selectionQuery, setSelectionQuery ]);


    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.down("sm"));


    return (
        <Dialog open={isOpen} onClose={close} fullScreen={small}>
            <DialogTitle sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <span>Sdílený seznam</span>
                <IconButton
                    sx={{ marginRight: -1 }}
                    disableTouchRipple
                    onClick={close}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {"Právě jste otevřeli sdílený seznam četby. Chcete jej uložit do\u00A0vašeho zařízení a\u00A0přepsat tak váš stávající seznam?"}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    sx={small ? { flex: 1, padding: 1.5, margin: 1 } : undefined}
                    color="error"
                    onClick={save}
                >
                    Uložit
                </Button>
                <Button
                    variant="outlined"
                    sx={small ? { flex: 1, padding: 1.5, margin: 1 } : undefined}
                    color="primary"
                    onClick={close}
                >
                    Neukládat
                </Button>
            </DialogActions>
        </Dialog>
    )

}