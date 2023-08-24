import React, { useState } from 'react';
import DatabaseLoader from './database/DatabaseLoader';
import useDatabase from './database/useDatabase';
import SelectionLoader from './selected/SelectionLoader';
import useSelection from './selected/useSelection';

import BookList from './BookList';


export default function App() {

    return (
        <DatabaseLoader>
            <SelectionLoader>
                <Dummy/>
            </SelectionLoader>
        </DatabaseLoader>
      );

}

function Dummy() {

    // const selection = useSelection();
    const { books } = useDatabase();
    
    return (<BookList ids={Object.values(books).map(book => book.id)}/>);
}

// function BookList() {

//     const { books, authors, categories } = useDatabase();
//     const selection = useSelection();

//     const checkSelection = () => {

//         const selectedBooks = selection.get().map(id => books.find(object => object.id == id)).filter(book=>!!book) as BookData[];

//         const authorCounts: Record<number, number> = {};
//         const categoryCounts: Record<number, number> = {};
    
//         selectedBooks.forEach(book => {
//             book.categories?.forEach(category =>
//                 categoryCounts[category] = (categoryCounts[category] | 0) + 1
//             )

//             book.authors?.forEach(author =>
//                 authorCounts[author] = (authorCounts[author] | 0) + 1
//             )
//         });

//         return (
//             <div>
//                 { (categoryCounts[1] | 0) < 2 ? (<p>Nedostatek prózy</p>) : null }
//                 { (categoryCounts[2] | 0) < 2 ? (<p>Nedostatek poezie</p>) : null }
//                 { (categoryCounts[3] | 0) < 2 ? (<p>Nedostatek dramatu</p>) : null }

//                 { (categoryCounts[6] | 0) < 2 ? (<p>Nedostatek literatury do konce 18. stol</p>) : null }
//                 { (categoryCounts[7] | 0) < 3 ? (<p>Nedostatek literatury 19. stol</p>) : null }
//                 { (categoryCounts[8] | 0) < 3 ? (<p>Nedostatek světové literatury 20. a 21. stol</p>) : null }
//                 { (categoryCounts[9] | 0) < 3 ? (<p>Nedostatek české literatury 20. a 21. stol</p>) : null }
//             </div>      
//         )

//     }

//     return (
//         <>
//             { checkSelection() }
//             <div className="bookList">
//                 {books
//                 .map(book => {
//                     return {
//                         id: book.id,
//                         name: book.name,
//                         note: book.note,
//                         author: book.authors?.map(id => authors.find(object => object.id == id)?.full_name ?? null  )?.join(", ") ?? null,
//                         category: book.categories?.map(id => categories.find(object => object.id == id)?.name ?? null  )?.join(", ") ?? null,
//                     };
//                 })
//                 .map(book => {
//                     return (
//                         <BookItem
//                             id={`${book.id}`}
//                             title={`${book.name}`}
//                             century={`${10}`}
//                             author={`${book.author}`}
//                             category={`${book.category}`}
//                         />
//                     )
//                 })
//                 }
//             </div>
//         </>
//       );

// }