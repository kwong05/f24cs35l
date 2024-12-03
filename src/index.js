import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    BrowserRouter>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
    <App />
    </BrowserRouter>
  </StrictMode>
);
