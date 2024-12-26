import React, { useState, useEffect } from "react";
import {
  getBooks,
  getMembers,
  borrowBook,
  getBorrowedBooks,
  returnBook,
} from "../utils/api";
import "./BorrowPage.css";

// Convert local time (Egypt time) to UTC before saving
const convertToUTC = (dateString) => {
  const localDate = new Date(dateString);
  const utcDate = new Date(
    localDate.toLocaleString("en-US", { timeZone: "Africa/Cairo" })
  );
  return utcDate.toISOString(); // Return the UTC time in ISO 8601 format
};

// Convert UTC time to Egypt local time when displaying
const formatDateToLocalTime = (utcDateString) => {
  const utcDate = new Date(utcDateString);
  return utcDate.toLocaleString("en-US", { timeZone: "Africa/Cairo" });
};

function BorrowPage() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [status, setStatus] = useState("");
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const booksData = await getBooks();
        const membersData = await getMembers();
        const borrowedBooksData = await getBorrowedBooks();

        setBooks(booksData);
        setMembers(membersData);

        // Enrich borrowed books with title, member name, and fine
        const enrichedBorrowedBooks = borrowedBooksData.map((borrowedBook) => {
          const borrowedBookWithTitle = booksData.find(
            (book) => book.id === borrowedBook.book_id
          );
          const member = membersData.find(
            (member) => member.id === borrowedBook.member_id
          );

          return {
            ...borrowedBook,
            book_title: borrowedBookWithTitle
              ? borrowedBookWithTitle.title
              : "Unknown Title",
            member_name: member ? member.name : "Unknown Member",
            fine: borrowedBook.fine || 0, // Ensure fine is included in response
          };
        });

        setBorrowedBooks(enrichedBorrowedBooks);
      } catch (error) {
        console.error("Error fetching data:", error);
        setStatus("Error fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBorrow = async (e) => {
    e.preventDefault();

    // Get current date in Egypt time (UTC+2)
    const borrowDate = new Date().toLocaleString("en-US", {
      timeZone: "Africa/Cairo",
    });

    // Convert the local time to UTC before saving
    const borrowDateUTC = convertToUTC(borrowDate);

    try {
      const response = await borrowBook(bookId, memberId, borrowDateUTC); // Pass the UTC date-time to the backend
      if (response.message === "Borrow record added successfully") {
        setStatus("Book borrowed successfully!");

        const borrowedBook = books.find((book) => book.id === parseInt(bookId));
        const member = members.find(
          (member) => member.id === parseInt(memberId)
        );

        const newBorrowedBook = {
          id: response.borrow.id,
          book_title: borrowedBook ? borrowedBook.title : "Unknown Title",
          member_name: member ? member.name : "Unknown Member",
          borrow_date: borrowDateUTC, // Save the UTC borrow date
          return_date: null,
          fine: null, // No fine on borrowing
        };

        setBorrowedBooks((prevBorrowedBooks) => [
          ...prevBorrowedBooks,
          newBorrowedBook,
        ]);

        setBookId("");
        setMemberId("");
      } else {
        setStatus("Failed to borrow the book.");
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      setStatus("Error borrowing book.");
    }
  };

  const handleReturn = async (borrowId) => {
    const currentDate = new Date().toISOString();

    // Calculate fine first
    const fineAmount = calculateFine(
      borrowedBooks.find((book) => book.id === borrowId).borrow_date,
      currentDate
    );

    setBorrowedBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === borrowId
          ? {
              ...book,
              return_date: currentDate, // Optimistically set return date
              fine: fineAmount, // Update the fine
            }
          : book
      )
    );

    try {
      const response = await returnBook(borrowId, fineAmount); // Send fine to backend

      if (
        response.status === "Success" ||
        response.message === "Book returned successfully"
      ) {
        setStatus("Book returned successfully!");
      } else {
        setStatus("An unexpected response was received. Please check logs.");
      }
    } catch (error) {
      console.error("Error returning book:", error);

      // Revert optimistic update if error occurs
      setBorrowedBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === borrowId
            ? {
                ...book,
                return_date: null,
                fine: null, // Reset fine on error
              }
            : book
        )
      );

      setStatus("Error returning book. Please try again.");
    }
  };

  // Fine calculation logic (in minutes)
  const calculateFine = (borrowDate, returnDate) => {
    const borrowDateTime = new Date(borrowDate);
    const returnDateTime = new Date(returnDate);

    const diffInMinutes = (returnDateTime - borrowDateTime) / (1000 * 60);
    const gracePeriodMinutes = 1;
    const finePerMinute = 10;

    if (diffInMinutes > gracePeriodMinutes) {
      return (diffInMinutes - gracePeriodMinutes) * finePerMinute;
    } else {
      return 0; // No fine if within grace period
    }
  };

  return (
    <div className="borrow-page">
      <h2>Borrow a Book</h2>

      <form onSubmit={handleBorrow} className="borrow-form">
        <div>
          <label htmlFor="bookId">Book:</label>
          <select
            id="bookId"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            required
          >
            <option value="">Select a Book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="memberId">Member:</label>
          {isLoading ? (
            <p>Loading members...</p>
          ) : (
            <select
              id="memberId"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required
            >
              <option value="">Select a Member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.phone})
                </option>
              ))}
            </select>
          )}
        </div>

        <button type="submit">Borrow Book</button>
      </form>

      <h3>Borrowed Books</h3>
      {borrowedBooks.length === 0 ? (
        <p>No books have been borrowed yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Member Name</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
              <th>Fine</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((borrow) => {
              const fine = borrow.fine || 0;

              return (
                <tr key={borrow.id}>
                  <td>{borrow.book_title}</td>
                  <td>{borrow.member_name}</td>
                  <td>{formatDateToLocalTime(borrow.borrow_date)}</td>
                  <td>
                    {borrow.return_date
                      ? formatDateToLocalTime(borrow.return_date)
                      : "Not Returned Yet"}
                  </td>
                  <td>
                    {Number(fine) > 0
                      ? `$${Number(fine).toFixed(2)}`
                      : "No Fine"}
                  </td>
                  <td>
                    {borrow.return_date === null ? (
                      <button onClick={() => handleReturn(borrow.id)}>
                        Return Book
                      </button>
                    ) : (
                      "Returned"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {status && <p>{status}</p>}
    </div>
  );
}

export default BorrowPage;
