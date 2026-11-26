import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMyShapes } from "../../hooks/useMyShapes";
import MapView from "../dashboard/MapView";
import { formatArea, totalGeodesicArea } from "../dashboard/geo";

const Row = ({ label, value }) => (
  <Typography>
    <Typography component="span" color="text.secondary">{label}: </Typography>
    {value}
  </Typography>
);

export default function Profile() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const p = profile || {};
  const { shapes } = useMyShapes();
  const area = useMemo(() => formatArea(totalGeodesicArea(shapes.map((s) => s.feature))), [shapes]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 2, py: { xs: 3, md: 6 } }}>
      <Card sx={{ width: "100%", maxWidth: 520 }} elevation={3}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h4" component="h1" color="primary">{t("My Profile")}</Typography>
            <Avatar
              variant="rounded"
              src={p.imageurl || "https://via.placeholder.com/400x300"}
              alt={t("Uploaded Images")}
              sx={{ width: 400, height: 300, maxWidth: "100%" }}
            />
            <Stack spacing={1} sx={{ alignSelf: "stretch" }}>
              <Row label={t("Username")} value={p.firstName} />
              <Row label={t("LastName")} value={p.lastName} />
              <Row label={t("Email")} value={p.email} />
              <Row label={t("City")} value={p.city} />
              <Row label={t("Telephone number")} value={p.telephone} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ width: "100%", maxWidth: 520, mt: 3 }} elevation={3}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Stack spacing={2}>
            <Typography variant="h5" component="h2" color="primary">{t("profile.fields")}</Typography>
            {shapes.length ? (
              <Typography>{t("profile.fieldsCount", { count: shapes.length })} &middot; {t("profile.fieldsArea", { area })}</Typography>
            ) : (
              <Typography color="text.secondary">{t("profile.fieldsEmpty")}</Typography>
            )}
            <Box sx={{ position: "relative", height: 360 }}>
              <MapView editable={false} savedShapes={shapes} />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
