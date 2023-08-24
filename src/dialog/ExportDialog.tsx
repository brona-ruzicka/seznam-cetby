import React from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";

import dayjs from 'dayjs';
import "dayjs/locale/cs";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";


import Close from "@mui/icons-material/Close";


import useCookie from "../cookie/useCookie";
import useGlobalStateValue from "../globalstate/useGlobalStateValue";
import SeznamCetby from "../pdf/SeznamCetby";
import useSelection from "../selection/useSelection";
import useDatabase from "../database/useDatabase";
import ReactPDF, { pdf } from "@react-pdf/renderer";


const CLASSES = [ "Oktáva", "4. AJ", "4. B", "4. E", "4. I" ];


export default function ExportDialog() {

    const [ print, setPrint ] = useGlobalStateValue("export");
    
    const isOpen = !!print;
    const close = () => setPrint(null);

    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.down("sm"));

    const [ personName, setPersonName ] = useCookie("person_name");
    const [ personClass, setPersonClass ] = useCookie("person_class");
    const [ examYear, setExamYear ] = useCookie("exam_year");

    const [ showDate, setShowDate ] = useCookie("show_date");
    const [ dateOfIssue, setDateOfIssue ] = useCookie("date_of_issue");

    const [ pronouncement, setPronouncement ] = useCookie("pronouncement");


    const selection = useSelection();
    const database = useDatabase();
    const books = React.useMemo(() => database.loaded ? selection.map(id => database.books[id]) : [], [ selection, database]);

    
    return (
        <Dialog open={isOpen} onClose={close} fullScreen={small}>
            <DialogTitle sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <span>Exportovat seznam do PDF</span>
                <IconButton
                    sx={{ marginRight: -1 }}
                    disableTouchRipple
                    onClick={close}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {"Doplňte prosím následující údaje potřebné pro vytvoření souboru."}
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"cs"}>
                    <Grid container sx={{ paddingTop: 4 }} spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Jméno a příjmení"
                                    value={personName ?? ""}
                                    onChange={event => setPersonName(event.target.value)}
                                    variant="outlined"
                                />
                                <Autocomplete
                                    freeSolo
                                    openOnFocus
                                    options={CLASSES}
                                    inputValue={personClass ?? ""}
                                    onInputChange={(_,value) => setPersonClass(value)}
                                    renderInput={(params) => <TextField {...params} label="Třída" />}
                                />
                                <DatePicker
                                    label="Rok maturity"
                                    value={examYear ? dayjs(examYear, "YYYY") : dayjs(new Date())}
                                    onChange={(value) => setExamYear(value?.format("YYYY") ?? null, { expires: 7 })}
                                    format={"YYYY"}
                                    views={["year"]}
                                />

                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack sx={{ height: "100%" }} spacing={2}>
                                <Stack>
                                    <DatePicker
                                        label="Datum podpisu"
                                        disabled={showDate === "false"}
                                        value={dateOfIssue ? dayjs(dateOfIssue, "YYYY-MM-DD") : dayjs(new Date())}
                                        onChange={(value) => setDateOfIssue(value?.format("YYYY-MM-DD") ?? null, { expires: 7 })}
                                        format={"DD.MM.YYYY"}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={showDate === "false"}
                                            onChange={event => setShowDate(`${!event.target.checked}`, { expires: 7 })}
                                        />}
                                        label="Nevyplňovat datum"
                                        sx={{marginTop: "0 !important"}}
                                    />
                                </Stack>
                                <Stack> 
                                    <Typography variant="body2" color={pronouncement === "false" ? "GrayText" : undefined}>
                                        {"K\u00A0seznamu četby je třeba přiložit prohlášení o\u00A0splnění požadavků."}
                                    </Typography>
                                    <FormControlLabel
                                        control={<Checkbox 
                                            checked={pronouncement === "false"}
                                            onChange={event => setPronouncement(`${!event.target.checked}`, { expires: 7 })}
                                        />}
                                        label="Netisknout prohlášení"
                                        sx={{marginTop: "0 !important"}}
                                    />
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Buttons
                    small={small}
                    document={(
                        <SeznamCetby
                            personName={personName ?? ""}
                            personClass={personClass ?? ""}
                            yearOfExam={dayjs(examYear ? examYear : new Date()).format("YYYY")}
                            dateOfIssue={(showDate !== "false") ? dayjs(dateOfIssue ? dateOfIssue : new Date()).format("D. M. YYYY") : null}
                            pronouncement={pronouncement !== "false"}
                            books={books}
                        />
                    )}
                />
            </DialogActions>
        </Dialog>
    )

}

(window as any).dayjs = dayjs;

const Buttons = (props: {
    small: boolean,
    document: React.ReactElement<ReactPDF.DocumentProps>
}) => {

    return (
        <>
            <Button
                variant="outlined"
                sx={props.small ? { flex: 1, padding: 1.5, margin: 1 } : undefined}
                color="primary"
                onClick={() => {
                    setTimeout(async () => {
                        const blob = await pdf(props.document).toBlob();
                        const url = URL.createObjectURL(blob);
                        
                        const a = document.createElement("a");
                        a.style.display = "none";
                        a.href = url;
                        a.download = "seznam-cetby.pdf";

                        document.body.appendChild(a);
                        a.click();
                        
                        window.URL.revokeObjectURL(url);
                    }, 0);
                }}
            >
                Stáhnout
            </Button>
            { navigator.pdfViewerEnabled &&
                (
                    <Button
                        variant="outlined"
                        sx={props.small ? { flex: 1, padding: 1.5, margin: 1 } : undefined}
                        color="primary"
                        onClick={() => {
                            setTimeout(async () => {
                                const blob = await pdf(props.document).toBlob();
                                const url = URL.createObjectURL(blob);
                                const win = window.open(url);

                                if (!win) return;
                                win.onload = () => { win.onbeforeunload = () => URL.revokeObjectURL(url); }
                            }, 0);
                        }}
                    >
                        Zobrazit
                    </Button>
                )
            }
        </>
    );

}