import moment from "moment";
import { useTranslation } from "react-i18next";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function Notifications({ notifications }) {
  const { t } = useTranslation();
  return (
    <Paper>
      {notifications.length ? (
        <List>
          {notifications.map((item) => (
            <ListItem key={item.id} divider>
              <ListItemText
                primary={`${item.user} - ${item.content}`}
                secondary={item.time?.toDate ? moment(item.time.toDate()).fromNow() : ""}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary" sx={{ p: 3 }}>
          {t("admin.noNotifications")}
        </Typography>
      )}
    </Paper>
  );
}
