import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BookPage";
import MembersPage from "./pages/MemberPage";
import BorrowPage from "./pages/BorrowPage";
import "./App.css"; // Import the updated CSS file

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Library Management System</h1>
        <div className="routes-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/borrow" element={<BorrowPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
