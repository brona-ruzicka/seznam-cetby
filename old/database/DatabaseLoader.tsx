import React, { useEffect } from "react";

import DatabaseContext from "./DatabaseContext";
import { Database, BookItem, AuthorItem, CategoryItem, EMPTY_DATABASE, WriteableBookItem, WriteableAuthorItem, WriteableCategoryItem } from "./databaseStructure";
import { Reference, AuthorData, BookData, CategoryData } from "./dataStructure";

import data from "../data/data.json";



export default function DatabaseLoader(props: {
    children? : React.ReactNode | undefined,
}) {
    const [ database, setDatabase ] = React.useState(EMPTY_DATABASE);

    
    useEffect(() => {

        const { books: bookArray, authors: authorArray, categories: categoryArray } = data;



        
        const bookRecord: Record<number, WriteableBookItem & { authors: WriteableAuthorItem[], categories: WriteableCategoryItem[] }> = {};
        const authorRecord: Record<number, WriteableAuthorItem & { books: WriteableBookItem[], categories: WriteableCategoryItem[] }> = {};
        const categoryRecord: Record<number, WriteableCategoryItem & { books: WriteableBookItem[], authors: WriteableAuthorItem[] }> = {};


        authorArray.forEach(author => authorRecord[author.id] = {
            id: author.id,
            short: author.short ?? author.name,
            name: author.name,
            born: author.born,

            books: [],
            categories: [],
        });
        categoryArray.forEach(category => categoryRecord[category.id] = {
            id: category.id,
            short: category.short ?? category.name,
            name: category.name,

            books: [],
            authors: [],
        });

        bookArray.forEach(book => {
            const bookItem = bookRecord[book.id] = {
                id: book.id,
                name: book.name,
                note: book.note,
                published: book.published,
                
                authors: book.authors?.map(id => authorRecord[id]) ?? [],
                categories: book.categories?.map(id => categoryRecord[id]) ?? [],
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
                        category.authors.push(author)
                });
            });

        });

        const newDatabase: Database = {
            loaded: true,
            books: bookRecord,
            authors: authorRecord,
            categories: categoryRecord,
        }

        setDatabase(newDatabase);

    }, [ data ]);

    return (
        <DatabaseContext.Provider
            value={ database }
        >
            { props.children }
        </DatabaseContext.Provider>
    );
};







