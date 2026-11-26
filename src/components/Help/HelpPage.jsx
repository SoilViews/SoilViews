import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function HelpPage() {
  const { t } = useTranslation();
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>{t("Documentation")}</Typography>
      {["help.page", "help.instructions", "help.everyAction"].map((k) => (
        <Typography key={k} color="text.secondary" paragraph>{t(k)}</Typography>
      ))}
    </Container>
  );
}
