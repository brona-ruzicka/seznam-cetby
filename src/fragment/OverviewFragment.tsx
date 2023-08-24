import React from "react";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";


import CollapseAlert from "../component/CollapseAlert";
import TwoPartChip from "../component/TwoPartChip";

import { useOverflowDetector } from "react-detectable-overflow";
import useAutoCollapse from '../autocollapse/useAutoCollapse';
import useDatabase from "../database/useDatabase";
import useCounts from "../counts/useCounts";
import useSearch from "../hook/useSearch";
import useShare from "../hook/useShare";
import useGlobalStateModifier from "../globalstate/useGlobalStateModifier";
import useQueryParam from "../queryparams/useQueryParam";


export default function OverviewFragment() {

    const database = useDatabase();
    const counts = useCounts();

    const search = useSearch();
    const share = useShare();
    const modify = useGlobalStateModifier();

    let buttonEnabled = database.loaded;
    let alerts = undefined;

    if (database.loaded) {

        const totalRequired = database.extra.bookLimit.min;
        const totalUnder = totalRequired && counts.total < totalRequired;
        const totalOver = totalRequired && counts.total > totalRequired;

        const totalAlert = (
            <InformationAlert
                status={totalUnder ? "error" : totalOver ? "warning" : "success"}
                title="Počet děl"
                description={
                      totalUnder ? `Vybráno příliš málo děl.`
                    : totalOver ? `Vybrán nadbytečný počet děl.`
                    : `Požadavek splněn.`
                }
                list={(totalOver || totalUnder || undefined) && [{
                    key: "",
                    component: (
                        <TwoPartChip
                            sx={{ margin: 0.5 }}
                            onClick={() => search("Vybráno")}
                            variant="outlined"
                            size="small"
                            primary={"Počet děl"}
                            secondary={`${counts.total} / ${totalRequired}`}
                        /> 
                    )
                }]}
            />
        );
        buttonEnabled &&= !totalUnder;


        const categoryProblems = Object.entries(counts.categories)
            .map(([id, count]) => [ database.categories[id as any], count ] as const)
            .filter(([category, count]) => category.limit.min && count < category.limit.min);

        const categoryEraProblems = categoryProblems.filter(([category, _]) => category.kind === "era");
        const categoryFormProblems = categoryProblems.filter(([category, _]) => category.kind === "form");
        
        const categoryAlerts = (
            <>
                <InformationAlert
                    status={categoryEraProblems.length ? "error" : "success"}
                    title="Časová období"
                    description={categoryEraProblems.length
                        ? "Je vyžadováno více děl z\u00A0těchto období:"
                        : "Požadavky na\u00A0časová období splněny."
                    }
                    list={
                        categoryEraProblems.map(([category, count]) => ({
                            key: category.id,
                            component: (
                                <TwoPartChip
                                    sx={{ margin: 0.5 }}
                                    onClick={() => search(category.name)}
                                    variant="outlined"
                                    size="small"
                                    primary={category.short}
                                    secondary={`${count} / ${category.limit.min}`}
                                /> 
                            ),
                        }))
                    }
                />
                <InformationAlert
                    status={categoryFormProblems.length ? "error" : "success"}
                    title="Typy děl"
                    description={categoryFormProblems.length
                        ? "Je vyžadováno více děl těchto typů:"
                        : "Požadavky na\u00A0typy děl splněny."
                    }
                    list={
                        categoryFormProblems.map(([category, count]) => ({
                            key: category.id,
                            component: (
                                <TwoPartChip
                                    sx={{ margin: 0.5 }}
                                    onClick={() => search(category.name)}
                                    variant="outlined"
                                    size="small"
                                    primary={category.short}
                                    secondary={`${count} / ${category.limit.min}`}
                                /> 
                            ),
                        }))
                    }
                />
            </>
        );
        buttonEnabled &&= !categoryProblems.length;


        const authorRequired = database.extra.authorLimit.max;
        const authorProblems = Object.entries(counts.authors)
            .map(([id, count]) => [ database.authors[id as any], count ] as const)
            .filter(([_, count]) => authorRequired && count > authorRequired );

        const authorAlert = (
            <InformationAlert
                status={authorProblems.length ? "error" : "success"}
                title="Autoři"
                description={authorProblems.length
                    ? "Je vybráno příliš mnoho děl od\u00A0těchto autorů:"
                    : "Požadavek na\u00A0maximální počet děl od\u00A0jednoho autora splněn."
                }
                list={
                    authorProblems.map(([author, count]) => ({
                        key: author.id,
                        component: (
                            <TwoPartChip
                                sx={{ margin: 0.5 }}
                                onClick={() => search(author.name)}
                                variant="outlined"
                                size="small"
                                primary={author.name}
                                secondary={`${count} / ${authorRequired}`}
                            /> 
                        ),
                    }))
                }
            />
        );
        buttonEnabled &&= !authorProblems.length;


        alerts = (
            <>
                {totalAlert}
                {categoryAlerts}
                {authorAlert}
            </>
        );
    }

    const { ref, overflow } = useOverflowDetector({});
    const [ sParam, ] = useQueryParam("s");
    const isShared = sParam !== null;

    return (
        <Stack sx={{ height: "100%" }}>
            <Stack
                ref={ref as any}
                spacing={2}
                sx={{
                    flex: 1,
                    overflow: "auto",
                    padding: 2,
                    paddingBottom: overflow ? 2 : isShared ? 1 : 0,
                    transition: theme => theme.transitions.create("padding-bottom")
                }}
            >
                {alerts}
            </Stack>
            <Fade in={overflow}>
                <Divider/>
            </Fade>
            { isShared && (
                <ButtonBase
                    sx={{
                        marginBottom: -2,
                        paddingLeft: 2,
                        paddingRight: 2,
                        height: theme => theme.spacing(4),
                        justifyContent: "start"
                    }}
                    onClick={() => modify({ share_alert: null })}
                >
                    <Typography variant="subtitle2" color="GrayText" lineHeight="unset">Prohlížíte si sdílený seznam</Typography>
                </ButtonBase>
            )}
            <Stack
                spacing={2}
                direction="row"
                sx={{
                    padding: 2,
                }}
            >
                <Button variant="outlined" size="medium" sx={{ flex: 1, padding: 1.5 }} onClick={share}>Sdílet</Button>
                <Button variant="outlined" size="medium" disabled={!buttonEnabled} sx={{ flex: 1, padding: 1.5 }} onClick={() => modify({ export: "open" })}>Export</Button>
            </Stack>
        </Stack>
    )
}

const InformationAlert = (props: {
    status: "success" | "warning" | "error",
    title?: React.ReactNode | undefined,
    description?: React.ReactNode | undefined,
    list?: { key: React.Key, component: React.ReactNode }[] | undefined
}) => {

    const collapsed = useAutoCollapse();
    const theme = useTheme();

    return (<CollapseAlert
        in={!collapsed}
        variant={theme.palette.mode === "light" ? "standard" : "outlined"}
        severity={props.status}
        title={props.title}
    >
        {props.description}
        { !!props.list?.length && (
            <Box sx={{ paddingTop: 1, overflow: "visible" }}>
                    {
                        props.list.map(({key, component}) => (
                            <React.Fragment key={key}>
                                {component}
                            </React.Fragment>
                        ))
                    }
            </Box>
        )}   
    </CollapseAlert>);

}
