import React, { useState } from 'react';
import data from './data.json';

import './App.css';

const books = data.books

function App() {
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [satisfiesConditions, setSatisfiesConditions] = useState({
    total: false,
    authors: false,
    category18: false,
    category19: false,
    category20c: false,
    category20w: false,
    prose: false,
    poesy: false,
    drama: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleBookSelect = (book) => {
    const updatedSelectedBooks = [...selectedBooks, book];
    setSelectedBooks(updatedSelectedBooks);
    checkConditions(updatedSelectedBooks);
  };

  const handleBookDeselect = (book) => {
    const updatedSelectedBooks = selectedBooks.filter(selectedBook => selectedBook.id !== book.id);
    setSelectedBooks(updatedSelectedBooks);
    checkConditions(updatedSelectedBooks);
  };

  const checkConditions = (books) => {
    const authorCounts = {};
    const categoryCounts = {
      "18": 0,
      "19": 0,
      "20c": 0,
      "20w": 0
    };
    const typeCounts = {
      "prose": 0,
      "poesy": 0,
      "drama": 0
    };

    for (let book of books) {
      // Count authors
      const author = book.author;
      if (!authorCounts[author]) {
        authorCounts[author] = 1;
      } else {
        authorCounts[author]++;
      }

      // Count categories
      const category = book.category;
      if (category in categoryCounts) {
        categoryCounts[category]++;
      }

      // Count types
      const type = book.type;
      if (type in typeCounts) {
        typeCounts[type]++;
      }
    }

    // Check conditions
    const satisfies = {
      total: books.length === 20,
      authors: Object.values(authorCounts).every(count => count <= 2),
      category18: categoryCounts["18"] >= 2,
      category19: categoryCounts["19"] >= 3,
      category20w: categoryCounts["20w"] >= 4,
      category20c: categoryCounts["20c"] >= 5,
      prose: typeCounts["prose"] >= 2,
      poesy: typeCounts["poesy"] >= 2,
      drama: typeCounts["drama"] >= 2,
    };

    setSatisfiesConditions(satisfies);
  };

  const renderBook = (book) => {
    const isSelected = selectedBooks.some(selectedBook => selectedBook.id === book.id);
    return (
      <div
        key={book.id}
        className={`bookItem ${isSelected ? "selectedBook" : ""}`}
        onClick={() => isSelected ? handleBookDeselect(book) : handleBookSelect(book)}
        >
        <h3 className="bookTitle">{book.title}</h3>
        <p className="bookDetails">Author: {book.author} | Category: {book.category} | Type: {book.type}</p>
      </div>
    );
  };

  const renderBooks = () => {
    return (
      <div className="bookList">
        <input
          type="text"
          placeholder="Search for a book"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {books
          .filter(book =>
            searchTerm.toLowerCase().split(" ").every(word =>
              book.title.toLowerCase().includes(word.toLowerCase()) ||
              book.author.toLowerCase().includes(word.toLowerCase())
            )
          )
          .map(renderBook)
        }
      </div>
    );
  };

  const renderSelectedBooks = () => {
    const { total, authors, category18, category19, category20c, category20w, prose, poesy, drama } = satisfiesConditions;
    return (
      <div>
        {(!total || !authors || !category18 || !category19 || !category20c || !category20w || !prose || !poesy || !drama) &&
          <div>
            <h2>Conditions not satisfied:</h2>
            {!total && <p>Total number of books should be 20.</p>}
            {!authors && <p>No more than 2 books from the same author are allowed.</p>}
            {!category18 && <p>At least 2 books from the '18th century and earlier' category are required.</p>}
            {!category19 && <p>At least 3 books from the '19th century' category are required.</p>}
            {!category20c && <p>At least 5 books from the '20th and 21st century in czech' category are required.</p>}
            {!category20w && <p>At least 4 books from the '20th and 21st century in other languages' category are required.</p>}
            {!prose && <p>At least 2 prose books are required.</p>}
            {!poesy && <p>At least 2 poesy books are required.</p>}
            {!drama && <p>At least 2 drama books are required.</p>}
          </div>
        }
      </div>
    );
  };


  return (
    <div>
      <h1>Reading List Manager</h1>
      {renderBooks()}
      {renderSelectedBooks()}
    </div>
  );
}

export default App;
