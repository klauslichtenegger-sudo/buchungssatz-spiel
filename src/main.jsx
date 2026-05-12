import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import LandingPage from "./LandingPage.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LandingPage />
  </React.StrictMode>
);
