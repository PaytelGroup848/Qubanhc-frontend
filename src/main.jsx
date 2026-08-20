import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "12px",
          background: "#fff",
          color: "#111827",
          border: "1px solid #e5e7eb",
          boxShadow: "0 14px 35px rgba(15, 23, 42, 0.16)",
          fontWeight: 600,
          maxWidth: "420px",
        },
        success: {
          iconTheme: {
            primary: "#059669",
            secondary: "#fff",
          },
        },
        error: {
          style: {
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fff",
          },
        },
      }}
    />
  </StrictMode>,
);
