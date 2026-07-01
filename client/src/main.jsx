import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import { store } from "./features/store.js";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
          <ToastContainer position="bottom-right" theme="colored" />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
