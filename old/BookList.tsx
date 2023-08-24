import React from 'react';
import BookItem from './BookItem';
import './BookList.css';
import { Reference, BookData } from './database/dataStructure';

export default function BookList(props: {
    ids: readonly Reference<BookData>[]
}) {

    return (
        <div className="book-list">
            { props.ids.map(id => (<BookItem key={id} id={id}/>)) }
        </div>
    );
};

