import React, { useState } from "react";

function BorrowForm({ onSubmit }) {
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(bookId, memberId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Book ID: </label>
        <input
          type="number"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Member ID: </label>
        <input
          type="number"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          required
        />
      </div>
      <button type="submit">Borrow Book</button>
    </form>
  );
}

export default BorrowForm;
