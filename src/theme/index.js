import { createTheme } from "@mui/material/styles";

export const buildTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#2e6b3a" },
      secondary: { main: "#8a5a2b" },
    },
    shape: { borderRadius: 12 },
  });
