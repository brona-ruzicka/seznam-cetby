import React from "react";

import useDatabase from "../database/useDatabase"
import useCounts from "../counts/useCounts";
import useSearch from "../hook/useSearch";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemButton from "@mui/material/ListItemButton";


import AnimatedList from "../component/AnimatedList";


export default function CategoriesFragment() {

    const database = useDatabase();
    const counts = useCounts();
    const search = useSearch();

    if (!database.loaded)
        return (<></>);

    const categories = Object.entries(counts.categories)
        .map(([id, count]) => [ database.categories[id as any], count ] as const)
        .sort(([a, _], [b, __]) => a.id - b.id);

    return (
        <AnimatedList dense>
            {
                categories.map(([category, count]) => ({
                    key: category.id,
                    component: (
                        <ListItem
                            sx={{padding: 0}}
                        >
                            <ListItemButton
                                onClick={() => search(category.name)}
                            >
                                <ListItemText primary={category.name}/>
                            </ListItemButton>
                            <ListItemSecondaryAction  sx={{ pointerEvents: "none" }}>
                                <ListItemText secondary={`${count} / ${category.limit.min}`}/>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                }))
            }
        </AnimatedList>
    );

}