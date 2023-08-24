import React from "react";

import { DeepMutable } from "../typeutil";

import type { BookItem, AuthorItem, CategoryItem } from "./databaseStructure";
import DatabaseContext from "./DatabaseContext";
import databaseDefault from "./databaseDefault";

import data from "../data/data.json";




export default function DatabaseLoader(props: {
    children?: React.ReactNode | undefined,
}) {
    const [ database, setDatabase ] = React.useState(databaseDefault);

    
    React.useEffect(() => {

        const books: Record<number, DeepMutable<BookItem>> = {};
        const authors: Record<number, DeepMutable<AuthorItem>> = {};
        const categories: Record<number, DeepMutable<CategoryItem>> = {};


        data.authors.forEach(author => authors[author.id] = {
            id: author.id,
            short: author.short ?? author.name,
            name: author.name,
            aliases: author.aliases ?? [],
            born: author.born,

            books: [],
            categories: [],
        });
        data.categories.forEach(category => categories[category.id] = {
            id: category.id,
            short: category.short ?? category.name,
            name: category.name,
            kind: category.kind as any,
            limit: category.limit,

            books: [],
            authors: [],
        });

        data.books.forEach(book => {
            const bookItem = books[book.id] = {
                id: book.id,
                name: book.name,
                note: book.note,
                published: book.published,
                
                authors: book.authors?.map(id => authors[id]) ?? [],
                categories: book.categories?.map(id => categories[id]) ?? [],
            };

            bookItem.authors.forEach(author => {
                author.books.push(bookItem);
                bookItem.categories.forEach(category => {
                    if (!author.categories.includes(category))
                        author.categories.push(category)
                });
            });

            bookItem.categories.forEach(category => {
                category.books.push(bookItem);
                bookItem.authors.forEach(author => {
                    if (!category.authors.includes(author))
                        category.authors.push(author);
                });
            });

        });

        setDatabase({
            loaded: true,
            books: books,
            authors: authors,
            categories: categories,
            extra: data.extra
        });

    }, [ data ]);

    return (
        <DatabaseContext.Provider
            value={ database }
        >
            { props.children }
        </DatabaseContext.Provider>
    );
};







