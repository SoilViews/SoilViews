import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/StarBorder";

const tiers = [
  { id: "free", price: "0", lines: 4, variant: "outlined" },
  { id: "pro", price: "15", lines: 4, variant: "contained", popular: true },
  { id: "enterprise", price: "30", lines: 4, variant: "outlined" },
];

export default function Pricing() {
  const { t } = useTranslation();
  return (
    <>
      <Container maxWidth="sm" component="section" sx={{ pt: 8, pb: 6 }}>
        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
          {t("Pricing")}
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          {t("pricing.intro")}
        </Typography>
      </Container>
      <Container maxWidth="md" component="section" sx={{ pb: 6 }}>
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            <Grid key={tier.id} size={{ xs: 12, sm: tier.id === "enterprise" ? 12 : 6, md: 4 }}>
              <Card>
                <CardHeader
                  title={t(`pricing.${tier.id}.title`)}
                  subheader={tier.popular ? t("pricing.pro.subheader") : undefined}
                  slotProps={{ title: { align: "center" }, subheader: { align: "center" } }}
                  action={tier.popular ? <StarIcon /> : null}
                  sx={{ bgcolor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[700]) }}
                />
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "baseline", mb: 2 }}>
                    <Typography component="h2" variant="h3" color="text.primary">${tier.price}</Typography>
                    <Typography variant="h6" color="text.secondary">/{t("pricing.perMonth")}</Typography>
                  </Box>
                  <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
                    {Array.from({ length: tier.lines }, (_, i) => (
                      <Typography component="li" variant="subtitle1" align="center" key={i}>
                        {t(`pricing.${tier.id}.line${i + 1}`)}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant={tier.variant} color="primary">
                    {t(`pricing.${tier.id}.button`)}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
