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

import dayjs, { Dayjs } from 'dayjs';
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



export default function ExportDialog() {

    const [ print, setPrint ] = useGlobalStateValue("export");
    
    const isOpen = !!print;
    const close = () => setPrint(null);

    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.down("sm"));

    const [ personNameCookie, setPersonNameCookie ] = useCookie("person_name");
    const [ personName, setPersonNameText ] = React.useState(personNameCookie);
    const setPersonName = React.useCallback(
        (text: string|null) => {
            setPersonNameText(text);
            setPersonNameCookie(text);
        },
        [setPersonNameText, setPersonNameCookie]
    );

    const [ personClassCookie, setPersonClassCookie ] = useCookie("person_class");
    const [ personClass, setPersonClassText ] = React.useState(personClassCookie);
    const setPersonClass = React.useCallback(
        (text: string|null) => {
            setPersonClassText(text);
            setPersonClassCookie(text); 
        },
        [setPersonClassText, setPersonClassCookie]
    );

    const [ examYearCookie, setExamYearCookie ] = useCookie("exam_year");
    const [ examYear, setExamYearValue ] = React.useState<Dayjs|null>(examYearCookie ? dayjs(examYearCookie, "YYYY") : dayjs(new Date()));
    const setExamYear = React.useCallback(
        (value: Dayjs|null) => {
            setExamYearValue(value);
            setExamYearCookie(value?.format("YYYY") ?? null, { expires: 7 });
        },
        [setExamYearValue, setExamYearCookie]
    );

    const [ showDate, setShowDate ] = useCookie("show_date");

    const [ dateOfIssueCookie, setDateOfIssueCookie ] = useCookie("date_of_issue");
    const [ dateOfIssue, setDateOfIssueValue ] = React.useState<Dayjs|null>(dateOfIssueCookie ? dayjs(dateOfIssueCookie, "YYYY-MM-DD") : dayjs(new Date()));
    const setDateOfIssue = React.useCallback(
        (value: Dayjs|null) => {
            setDateOfIssueValue(value);
            setDateOfIssueCookie(value?.format("YYYY-MM-DD") ?? null, { expires: 7 });
        },
        [setDateOfIssueValue, setDateOfIssueCookie]
    );

    const [ pronouncement, setPronouncement ] = useCookie("pronouncement");


    const selection = useSelection();
    const database = useDatabase();
    const books = React.useMemo(() => database.loaded ? selection.map(id => database.books[id]) : [], [ selection, database ]);
    const classNames = React.useMemo(() => database.loaded ? database.extra.classNames ?? [] : [], [ database ]);

    
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
                                    options={classNames}
                                    inputValue={personClass ?? ""}
                                    onInputChange={(_,value) => setPersonClass(value)}
                                    renderInput={(params) => <TextField {...params} label="Třída" />}
                                />
                                <DatePicker
                                    label="Rok maturity"
                                    value={examYear}
                                    onChange={(value) => setExamYear(value)}
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
                                        value={dateOfIssue}
                                        onChange={setDateOfIssue}
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