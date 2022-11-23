// imports
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// creates div with id "root", all elements within our react project will be inside this and further children
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // loads react twice to catch some bugs
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
