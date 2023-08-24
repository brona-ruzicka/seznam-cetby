import React from 'react';
import { Checkbox, ListItem, ListItemText, Stack, Chip, Link } from '@mui/material';
import useDatabase from './database/useDatabase';
import useSelection from './selected/useSelection';


export default function BookListItem(props: {
    id: number,
    name: string,
    author: {
        id: number,
        name: string,
    },
    categories: {
        id: number,
        name: string,
    },

    checked: boolean,
    onChange: Consumer<boolean>
}) {
    const { books, authors, categories } = useDatabase();

    const book = books[props.id];
    if (!book) {
        return null;
    }

    return (
        <ListItem
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1,
            }}
        >
        <BookCheckbox id={props.id}/>
        <ListItemText
            primary={
            <>
                {book.authors.map((author, index) => (
                <React.Fragment key={index}>
                    <Link
                        href={`/author/${author?.id}`}
                        sx={{ color: 'text.secondary', fontStyle: 'italic', marginRight: 1 }}
                    >
                    {author.short}
                    </Link>
                    {index !== book.authors.length - 1 && ', '}
                </React.Fragment>
                ))}
                {book.authors ? ' : ' : ''}
                {book.name}
            </>
            }
            secondary={book.note}
        />
        <Stack direction="row" spacing={1}>
            {book.categories?.map((category) => (
                <Chip
                    key={category.id}
                    label={category.name}
                    component={Link}
                    href={`/category/${category.id}`}
                    variant="outlined"
                    clickable
                />
            ))}
        </Stack>
        </ListItem>
    );
};

function BookCheckbox(props: {
    id: number
}) {

    const selection = useSelection();

    return (
        <Checkbox
            checked={selection.includes(props.id)}
            onChange={(e) => selection.set(props.id, e.target.checked)}
        />
    );

}