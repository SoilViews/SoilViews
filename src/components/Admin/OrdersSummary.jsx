import { useTranslation } from "react-i18next";
import Stack from "@mui/material/Stack";
import PeopleIcon from "@mui/icons-material/PeopleOutline";
import ReceiptIcon from "@mui/icons-material/ReceiptLongOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import StatCard from "./UsersSummary";

// Row of summary stat cards shown above the admin tabs.
export default function OrdersSummary({ users, orders, notifications }) {
  const { t } = useTranslation();
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
      <StatCard id="users" label={t("admin.users")} count={users} icon={<PeopleIcon color="primary" fontSize="large" />} />
      <StatCard id="orders" label={t("admin.orders")} count={orders} icon={<ReceiptIcon color="primary" fontSize="large" />} />
      <StatCard
        id="notifications"
        label={t("admin.notifications")}
        count={notifications}
        icon={<NotificationsIcon color="primary" fontSize="large" />}
      />
    </Stack>
  );
}
