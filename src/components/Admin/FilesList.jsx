import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { listFolder } from "../../services/storageService";

// Download links for everything in the UploadedFiles storage folder.
export default function FilesList() {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listFolder("UploadedFiles/")
      .then((f) => !cancelled && setFiles(f))
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <Alert severity="error">{t("admin.filesError")}</Alert>;
  return (
    <Paper>
      {files.length ? (
        <List>
          {files.map((f) => (
            <ListItem key={f.fullPath} disablePadding divider>
              <ListItemButton component="a" href={f.url} target="_blank" rel="noopener noreferrer">
                <ListItemText primary={f.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary" sx={{ p: 3 }}>
          {t("admin.noFiles")}
        </Typography>
      )}
    </Paper>
  );
}
