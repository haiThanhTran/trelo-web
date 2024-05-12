import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
//Cấu hình React toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <App />
    <ToastContainer position="bottom-left" />
  </CssVarsProvider>
);
