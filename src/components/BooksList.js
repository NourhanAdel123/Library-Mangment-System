import React from "react";
import "../pages/BooksPage.css"; // Ensure the CSS is imported

function BooksList({ books, onDeleteBook }) {
  return (
    <div className="books-list">
      {books.map((book) => (
        <div className="book-card" key={book.id}>
          <h3>{book.title}</h3>
          <p>Author: {book.author}</p>
          <p>ISBN: {book.isbn}</p>
          <p>Available Copies: {book.available_copies}</p>
          <button onClick={() => onDeleteBook(book.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default BooksList;
