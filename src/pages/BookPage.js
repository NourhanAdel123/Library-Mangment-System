import React, { useEffect, useState } from "react";
import BooksList from "../components/BooksList";
import { getBooks, addBook, deleteBook } from "../utils/api";
import "./BooksPage.css"; // Import CSS for styling

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false); // Control form visibility
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    available_copies: 0,
  });

  useEffect(() => {
    getBooks().then((data) => {
      setBooks(data);
    });
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const data = await addBook(newBook);
      setBooks((prevBooks) => [...prevBooks, data]); // Add new book to state
      setNewBook({
        title: "",
        author: "",
        isbn: "",
        available_copies: 0,
      }); // Reset form
      setShowForm(false); // Hide form after adding book
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const result = await deleteBook(bookId);
      if (result.status === "Success") {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      } else {
        console.error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="books-page">
      <h2 className="books-title">Books in the Library</h2>

      {/* Toggle Form Button */}
      <button
        className="toggle-form-btn"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Cancel" : "Add Book"}
      </button>

      {/* Add Book Form */}
      {showForm && (
        <form className="add-book-form" onSubmit={handleAddBook}>
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="ISBN"
            value={newBook.isbn}
            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Available Copies"
            value={newBook.available_copies}
            onChange={(e) =>
              setNewBook({ ...newBook, available_copies: e.target.value })
            }
            required
          />
          <button type="submit" className="submit-btn">
            Add Book
          </button>
        </form>
      )}

      <BooksList books={books} onDeleteBook={handleDeleteBook} />
    </div>
  );
}

export default BooksPage;
