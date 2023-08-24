import React from "react";

import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"

import Clear from "@mui/icons-material/Clear";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Abc from "@mui/icons-material/Abc";
import Person from "@mui/icons-material/Person";
import AccessTime from "@mui/icons-material/AccessTime";

import useDatabase from "../database/useDatabase";
import type { BookItem, AuthorItem, CategoryItem } from "../database/databaseStructure";

import useSelection from "../selection/useSelection";
import useAutohideQueryParam from "../queryparams/useAutohideQueryParam";
import useSearch from "../hook/useSearch";
import useCookie from "../cookie/useCookie";


const sorts = [
    "book_asc",
    "book_desc",
    "year_asc",
    "year_desc",
    "author_asc",
    "author_desc",
] as const;

type Sort = typeof sorts[number];


export default function SearchFragment() {

    const selection = useSelection();

    const database = useDatabase();

    const [ search, setSearch ] = useAutohideQueryParam("search");
    const [ sortStr, setSort ] = useCookie("sort");

    const sort: Sort = sorts.includes(sortStr as Sort) ? sortStr as Sort : sorts[0];
    const cycleSort = () => setSort(sorts[(sorts.indexOf(sort) + 1) % sorts.length]);


    const searchIndex = React.useMemo<Readonly<{
        books: (readonly [ string, BookItem ])[],
        authors: (readonly [ string, AuthorItem ])[],
        categories: (readonly [ string, CategoryItem ])[],
    }>>(() => {
        if (!database.loaded)
            return {
                books: [],
                authors: [],
                categories: [],
            };

        const books = Object.values(database.books).flatMap(book => [
            [normalize(book.name), book] as const,
            ...( book.note ? [ [ normalize(book.note), book ] as const ] : [] )
        ]);

        const authors = Object.values(database.authors).flatMap(author => [
            [normalize(author.name), author] as const,
            [normalize(author.short), author] as const,
            ...author.aliases?.map(alias => [normalize(alias), author] as const)
        ] as const);

        const categories = Object.values(database.categories).flatMap(category => [
            [normalize(category.name), category] as const,
            [normalize(category.short), category] as const,
        ] as const);

        return {
            books,
            authors,
            categories,
        };
    }, [ database ]);

    const matched = React.useMemo(() => {
        const normalized = normalize(search);
        const words = normalized.trim().split(/\s+/);

        const matches = words.map(word => {
            const books = [
                ...searchIndex.books.filter(([query, _]) => query.includes(word)).map(([_, book]) => book),
                ...searchIndex.authors.filter(([query, _]) => query.includes(word)).flatMap(([_, author]) => author.books),
                ...searchIndex.categories.filter(([query, _]) => query.includes(word)).flatMap(([_, category]) => category.books),
                ...((database.loaded && "selected selection vybrano vybrane vybrana vybrany vyber".includes(word) && selection.map(id => database.books[id])) || [])
            ].reduce((red, val) => {
                red[val.id] = val;
                return red;
            }, {} as Record<number, BookItem>);

            return books;
        });

        return Object.values(database.books)
            .filter(book => matches.every(match => book.id in match))
            .reduce((red, val) => {
                red[val.id] = val;
                return red;
            }, {} as Record<number, BookItem>);

    }, [searchIndex, search, selection, database ]);

    const sortedBooks = React.useMemo(() => {

        let sortingFun: (a: BookItem, b: BookItem) => number;

        switch (sort) {
            case "book_asc":
                sortingFun = (a,b) =>
                    a.name.localeCompare(b.name) ||
                    a.published - b.published;
                break;

            case "book_desc":
                sortingFun = (a,b) =>
                    b.name.localeCompare(a.name) || 
                    a.published - b.published;
                break;

            case "year_asc":
                sortingFun = (a,b)=> 
                    (a.published - b.published) ||
                    a.name.localeCompare(b.name);
                break;

            case "year_desc":
                sortingFun = (a,b) => 
                    (b.published - a.published) ||
                    a.name.localeCompare(b.name);
                break;

            case "author_asc":
                sortingFun = (a,b) => 
                    ((a.authors[0]?.short ?? "").localeCompare(b.authors[0]?.short ?? "")) ||
                    a.name.localeCompare(b.name);
                break;

            case "author_desc":
                sortingFun = (a,b) =>
                    ((b.authors[0]?.short ?? "").localeCompare(a.authors[0]?.short ?? "")) ||
                    a.name.localeCompare(b.name);;
                break;

        }

        return Object.values(database.books).sort(sortingFun!);

    }, [ sort, database ]);

    return (
        <Stack sx={{ height: "100%" }}>
            <Box sx={{ position: "relative" }}>
                <StyledTextField
                    variant="standard"
                    placeholder="Prohledat díla…"
                    autoFocus
                    fullWidth
                    value={search}
                    onChange={e => setSearch(e.target.value, true)}
                    onKeyUp={e => {
                        if (e.code === "Enter") {
                            e.preventDefault();

                            const values = Object.values(matched);
                            if (values.length !== 1) return;

                            selection.toggle(values[0].id);
                            setSearch("");
                        }
                    }}
                />
                <Stack
                    direction="row"
                    sx={{
                        position: "absolute",
                        top: "60%",
                        right: theme => theme.spacing(2),
                        transform: "translateY(-60%)",
                    }}
                >
                    <IconButton
                        onClick={() => setSearch("")}
                    >
                        <Clear/>
                    </IconButton>
                    <Tooltip
                        title={{
                            book_asc: "Řazení: Název díla, Vzestupně",
                            book_desc: "Řazení: Název díla, Sestupně",
                            year_asc: "Řazení: Rok vydání, Vzestupně",
                            year_desc: "Řazení: Rok vydání, Sestupně",
                            author_asc: "Řazení: Autor, Vzestupně",
                            author_desc: "Řazení: Autor, Sestupně",
                        }[sort]}
                    
                    >
                        <IconButton
                            onClick={cycleSort}
                            sx={{ position: "relative" }}
                        >
                            <ArrowDropUp
                                fontSize="small"
                                sx={{
                                    position: "absolute",
                                    pointerEvents: "none",
                                    top: "-10%",
                                }}
                                color={sort.endsWith("asc") ? "action" : "disabled"}
                            />
                            { sort.startsWith("book")   && <Abc/>        } 
                            { sort.startsWith("year")   && <AccessTime/> } 
                            { sort.startsWith("author") && <Person/>     }
                            <ArrowDropDown
                                fontSize="small"
                                sx={{
                                    position: "absolute",
                                    pointerEvents: "none",
                                    bottom: "-10%",
                                }}
                                color={sort.endsWith("desc") ? "action" : "disabled"}
                            />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
            <List sx={{ overflow: "auto" }}>
                {
                    sortedBooks.map(book => (
                        <ListItem key={book.id} sx={{ paddingRight: 4, paddingLeft: 4, ...(book.id in matched ? {} : { display: "none" }) }}>
                            <MemoListItemContent book={book} checked={selection.includes(book)} toggleChecked={() => selection.toggle(book.id)}/>
                        </ListItem>
                    ))
                }
            </List>
        </Stack>
    );

}


const normalize = (input: string): string => {
    return input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f,.:;?!_\\/-]/g, "");
}


const StyledTextField = styled(TextField)(({theme}) => ({
    "& > * > input": {
        height: theme.spacing(3),
        lineHeight: theme.spacing(3),
        padding: theme.spacing(2),
        paddingRight: theme.spacing(12),
        paddingTop: theme.spacing(3),
    }
}))

const CustomListItemContent = (props: {
    book: BookItem,
    checked: boolean,
    toggleChecked: () => void
}) => {

    const search = useSearch();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"))

    return (<>
        <ListItemButton
            role={undefined}
            onClick={props.toggleChecked}
            sx={{
                position: "absolute",
                padding: 0,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
            }}
        />
        <ListItemIcon>
            <Checkbox
                edge="start"
                checked={props.checked}
                tabIndex={-1}
                disableRipple
                sx={{ pointerEvents:"none" }}
            />
        </ListItemIcon>
        <ListItemText id={`${props.book.id}`}
            primary={
                (<>
                    {
                        isSmallScreen && (
                            (author) => author && author + ": "
                        )(
                            props.book.authors?.map(author => author.short).join(", ") || undefined
                        )
                    }
                    {props.book.name}
                </>)
            }
            secondary={
                (<>
                    {
                        !isSmallScreen && (
                            props.book.authors?.map(author => author.name).join(", ") || undefined
                        )
                    }
                    { !isSmallScreen && props.book.note && !!props.book.authors.length && (<br/>) }
                    {
                        props.book.note && (
                            <i>{ props.book.note }</i>
                        )
                    }
                    { isSmallScreen && props.book.note && !!props.book.categories.length && (<br/>) }
                    {
                        isSmallScreen && (
                            props.book.categories?.map(category => category.short).join(" • ") || undefined
                        )
                    }
                </>)
            }
        />
        {!isSmallScreen && (<Stack direction="row-reverse" spacing={1}>
            {props.book.categories.map(category => (
                <Chip
                    sx={{alignSelf: "end"}}
                    key={category.id}
                    size="small"
                    variant="outlined"
                    label={category.short}
                    onClick={() => search(category.name)}
                />
            ))}
        </Stack>)}
    </>)
}

const MemoListItemContent = React.memo(CustomListItemContent, (old, next) => {
    return old.book === next.book && old.checked === next.checked
});
