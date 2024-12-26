import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // Add this CSS file for styles

function HomePage() {
  return (
    <div className="homepage-container">
      <h2>Welcome to the Library</h2>
      <nav className="nav-container">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/books" className="nav-link">
              <img src="/images/books.jpg" alt="Books" className="nav-icon" />
              Books
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/members" className="nav-link">
              <img
                src="/images/members.jpg"
                alt="Members"
                className="nav-icon"
              />
              Members
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/borrow" className="nav-link">
              <img src="/images/borrow.jpg" alt="Borrow" className="nav-icon" />
              Borrow a Book
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default HomePage;
