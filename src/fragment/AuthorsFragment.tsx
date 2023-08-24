import React from "react";

import useDatabase from "../database/useDatabase"
import useCounts from "../counts/useCounts";
import useSearch from "../hook/useSearch";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";


import AnimatedList from "../component/AnimatedList";
import { Typography } from "@mui/material";


export default function AuthorsFragment() {

    const database = useDatabase();
    const counts = useCounts();
    const search = useSearch();

    if (!database.loaded)
        return (<></>);

    const authors = Object.entries(counts.authors)
        .filter(([_, count]) => count > 0)
        .map(([id, count]) => [ database.authors[id as any], count ] as const)
        .sort(([a, _], [b, __]) => a.short.localeCompare(b.short));

    return (
        <>
            <AnimatedList dense>
                {
                    authors.map(([author, count]) => ({
                        key: author.id,
                        component: (
                            <ListItem
                                sx={{padding: 0}}
                            >
                                <ListItemButton
                                    onClick={() => search(author.name)}
                                >
                                    <ListItemText primary={`${author.name}`}/>
                                </ListItemButton>
                                <ListItemSecondaryAction sx={{ pointerEvents: "none" }}>
                                    <ListItemText secondary={`${count} / ${database.extra.authorLimit.max}`}/>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    }))
                }
            </AnimatedList>
            <Collapse in={authors.length === 0}>
                <Typography
                    variant="body2"
                    align="center"
                    sx={{ padding: 2 }} 
                >
                    Zatím tu nic není…
                </Typography>
            </Collapse>
        </>
    );

}