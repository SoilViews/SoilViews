import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import teamPhoto from "./team.jpg";

export default function AboutUs() {
  const { t } = useTranslation();
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      {["about.placeholder1", "about.placeholder2", "about.placeholder3", "about.placeholder4", "about.placeholder5"].map((k) => (
        <Typography key={k} color="text.secondary" paragraph>{t(k)}</Typography>
      ))}
      <Divider sx={{ my: 4 }} />
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h3" component="h1" color="primary" gutterBottom>{t("Team")}</Typography>
        <Typography variant="h6" component="p" color="text.secondary" gutterBottom>
          {t("about.tagline")}
        </Typography>
        <Box component="img" alt={t("Team").toLowerCase()} src={teamPhoto} width={640} height={480}
          sx={{ maxWidth: "100%", height: "auto", borderRadius: 2, mt: 2 }} />
      </Box>
    </Container>
  );
}
