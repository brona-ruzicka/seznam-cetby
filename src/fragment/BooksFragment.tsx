import React from "react";

import useDatabase from "../database/useDatabase"
import useSelection from "../selection/useSelection";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";

import Clear from "@mui/icons-material/Clear";

import AnimatedList from "../component/AnimatedList";
import { Typography } from "@mui/material";


export default function BooksFragment() {

    const database = useDatabase();
    const selection = useSelection();

    if (!database.loaded)
        return (<></>);

    const books = selection
        .map(id => database.books[id])
        .sort((a,b) => a.name.localeCompare(b.name));

    return (
        <>
            <AnimatedList dense>
                {
                    books.map(book => ({
                        key: book.id,
                        component: (
                            <ListItem
                            >
                                <ListItemText primary={`${book.authors.length > 0 && (book.authors.map(author => author.short).join(", ") + ": ")}${book.name}`}/>
                                <ListItemSecondaryAction>
                                    <IconButton
                                        size="small"
                                        onClick={() => selection.remove(book)}
                                    >
                                        <Clear fontSize="small"/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    }))
                }
            </AnimatedList>
            <Collapse in={books.length === 0}>
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