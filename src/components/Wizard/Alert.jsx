import MuiAlert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";

// Inline hint shown while the crop step has no selection.
export default function Alert({ show }) {
  const { t } = useTranslation();
  if (!show) return null;
  return (
    <MuiAlert variant="outlined" severity="warning" sx={{ mb: 2 }}>
      {t("wizard.noCrop")}
    </MuiAlert>
  );
}
