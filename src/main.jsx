import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import BuchungssatzDragDropSpiel from "./BuchungssatzDragDropSpiel.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BuchungssatzDragDropSpiel />
  </React.StrictMode>
);
