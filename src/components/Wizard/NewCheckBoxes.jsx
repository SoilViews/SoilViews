import Grid from "@mui/material/Grid2";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { CROPS } from "./crops";

export const NewCheckboxes = ({ crops, handleCropChange }) => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={1}>
      {CROPS.map((crop) => (
        <Grid key={crop} size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={<Checkbox checked={crops[crop]} onChange={handleCropChange} name={crop} color="primary" />}
            label={t(`crop.${crop}`)}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -0.5 }}>
            {t(`crop.${crop}.examples`)}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default NewCheckboxes;
