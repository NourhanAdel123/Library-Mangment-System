import axios from "axios";

const API_URL = "http://localhost:5000";

// Fetch all books
export const getBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

// Fetch all members
export const getMembers = async () => {
  try {
    const response = await axios.get(`${API_URL}/members`);
    return response.data;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
};

// Fetch all borrowed books
export const getBorrowedBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/borrow`);
    return response.data;
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    return [];
  }
};

// Borrow a book
export const borrowBook = async (bookId, memberId) => {
  try {
    const response = await axios.post(`${API_URL}/borrow`, {
      book_id: bookId,
      member_id: memberId,
      borrow_date: new Date().toISOString(), // This gives you the full date and time in ISO format
    });
    return response.data;
  } catch (error) {
    console.error("Error borrowing book:", error);
    return { status: "Failed" };
  }
};

// Return a borrowed book
export const returnBook = async (borrowId, fine) => {
  try {
    // Log the borrowId and fine being sent
    console.log("Sending borrowId and fine to backend:", borrowId, fine);

    const response = await axios.post(`${API_URL}/borrow/return`, {
      borrowId: borrowId, // Ensure this matches the backend structure
      fine: fine, // Send the fine from frontend to backend
    });
    return response.data;
  } catch (error) {
    console.error("Error returning book:", error);
    return { status: "Failed" };
  }
};

// Add a new book
export const addBook = async (book) => {
  try {
    const response = await axios.post(`${API_URL}/books`, book);
    return response.data; // Return the added book data
  } catch (error) {
    console.error("Error adding book:", error);
    return { status: "Failed", error: error.response?.data || error.message };
  }
};

// Delete a book by ID
export const deleteBook = async (bookId) => {
  try {
    await axios.delete(`${API_URL}/books/${bookId}`);
    return { status: "Success" };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { status: "Failed", error: error.response?.data || error.message };
  }
};

// Add a new member
export const addMember = async (member) => {
  try {
    const response = await axios.post(`${API_URL}/members`, member);
    return response.data; // Return the added member data
  } catch (error) {
    console.error("Error adding member:", error);
    return { status: "Failed", error: error.response?.data || error.message };
  }
};

// Delete a member by ID
export const deleteMember = async (memberId) => {
  try {
    const response = await axios.delete(`${API_URL}/members/${memberId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
};
