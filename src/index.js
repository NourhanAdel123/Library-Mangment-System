import React from "react";
import ReactDOM from "react-dom/client"; // Make sure you're importing from 'react-dom/client'

import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // Create the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
