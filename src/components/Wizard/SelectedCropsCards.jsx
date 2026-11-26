import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";

export const SelectedCropsCards = ({ selectedCrops, area, location }) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={2}>
      <Typography variant="h6" component="h2">
        {t("wizard.review.title")}
      </Typography>
      <Typography variant="body2">{t("wizard.review.crops")}</Typography>
      <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
        {selectedCrops.map((crop) => (
          <Card key={crop} variant="outlined" sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
            <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
              <Typography>{t(`crop.${crop}`)}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Typography variant="body2">
        <strong>{t("wizard.review.area")}: </strong>
        {area}
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
        <strong>{t("wizard.review.location")}: </strong>
        {location}
      </Typography>
    </Stack>
  );
};

export default SelectedCropsCards;
