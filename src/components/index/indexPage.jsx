import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function IndexPage() {
  const { t } = useTranslation();
  return (
    <Box sx={{ textAlign: "center", px: 2, py: { xs: 4, md: 8 }, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h2" component="h1" color="primary" gutterBottom>
        {t("welcome")}
      </Typography>
      {["Get your soil analysis today", "Increase your predictability and crop yields", "we combine soil samples and Copernicus satelite imaging"].map((k) => (
        <Typography key={k} variant="h6" component="p" color="text.secondary" sx={{ mt: 2 }}>
          {t(k)}
        </Typography>
      ))}
      <Button component={RouterLink} to="/Dashboard" variant="contained" size="large" sx={{ mt: 5 }}>
        {t("Start Here")}
      </Button>
    </Box>
  );
}
