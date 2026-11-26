import { useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useCollection } from "../../hooks/useCollection";
import { usersQuery } from "../../services/usersService";
import { ordersQuery } from "../../services/ordersService";
import { notificationsQuery } from "../../services/notificationsService";
import { useAuth } from "../../context/AuthContext";
import OrdersSummary from "./OrdersSummary";
import UsersList from "./UsersList";
import OrdersList from "./OrdersList";
import Notifications from "./Notifications";
import FilesList from "./FilesList";

const TABS = ["users", "orders", "notifications", "files"];

// Route is guarded by RequireAuth roles={["Admin"]}.
export default function AdminPanel() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const uid = user?.uid;
  const [tab, setTab] = useState("users");
  const users = useCollection(() => usersQuery(), []);
  const orders = useCollection(() => ordersQuery({ uid, isAdmin: true }), [uid]);
  const notifications = useCollection(() => notificationsQuery(5), []);
  const loading = users.loading || orders.loading || notifications.loading;
  const error = users.error || orders.error || notifications.error;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        {t("AdminPanel")}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{t("admin.loadError")}</Alert>}
      <OrdersSummary users={users.data.length} orders={orders.data.length} notifications={notifications.data.length} />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" sx={{ mb: 2 }}>
        {TABS.map((id) => (
          <Tab key={id} value={id} label={t(`admin.${id}`)} id={`admin-tab-${id}`} aria-controls={`admin-panel-${id}`} />
        ))}
      </Tabs>
      <Box role="tabpanel" id={`admin-panel-${tab}`} aria-labelledby={`admin-tab-${tab}`}>
        {loading && tab !== "files" && <CircularProgress />}
        {!loading && tab === "users" && <UsersList users={users.data} />}
        {!loading && tab === "orders" && <OrdersList orders={orders.data} />}
        {!loading && tab === "notifications" && <Notifications notifications={notifications.data} />}
        {tab === "files" && <FilesList />}
      </Box>
    </Container>
  );
}
