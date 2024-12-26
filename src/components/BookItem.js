import React from "react";

function BookItem({ book, onDeleteBook }) {
  return (
    <div>
      <h3>{book.title}</h3>
      <p>Author: {book.author}</p>
      <p>ISBN: {book.isbn}</p>
      <p>Available Copies: {book.available_copies}</p>
      <button onClick={() => onDeleteBook(book.id)}>Delete</button>
    </div>
  );
}

export default BookItem;
