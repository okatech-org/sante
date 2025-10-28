import React from "react";
import { createRoot } from "react-dom/client";
import AppMain from "./AppMain";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppMain />
  </React.StrictMode>
);
