import React from "react";
import "tw-elements";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./assets/styles/tailwind.css";
import "./assets/styles/global.css";

import { LicenseProvider } from "./context/LicenseContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <LicenseProvider>
      <App />
  </LicenseProvider>
);
