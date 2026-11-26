import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function Acknowledgements() {
  const { t } = useTranslation();
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>{t("Acknowledgements")}</Typography>
      <Typography color="text.secondary">{t("ack.intro")}</Typography>
      <List>
        {["Copernicus", "Layers", "Technologies used"].map((k) => (
          <ListItem key={k} disableGutters>
            <ListItemText primary={t(k)} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
