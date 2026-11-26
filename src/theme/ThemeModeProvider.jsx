import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { buildTheme } from "./index";

const KEY = "soilviews-theme-mode";
const ThemeModeContext = createContext({ mode: "light", toggle: () => {} });

const initialMode = () => {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(initialMode);
  const toggle = useCallback(
    () =>
      setMode((m) => {
        const next = m === "light" ? "dark" : "light";
        try {
          localStorage.setItem(KEY, next);
        } catch {
          /* ignore */
        }
        return next;
      }),
    []
  );
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggle }), [mode, toggle]);
  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeModeContext);
