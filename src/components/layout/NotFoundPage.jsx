import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
      <Typography variant="h1" component="div" color="primary">404</Typography>
      <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 3 }}>{t("Go to Home")}</Button>
    </Box>
  );
}
