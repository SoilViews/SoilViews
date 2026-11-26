import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeModeProvider } from "./theme/ThemeModeProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeModeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeModeProvider>
  </StrictMode>
);
