import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useAuth } from "../../context/AuthContext";
import { useCollection } from "../../hooks/useCollection";
import { deleteOrder, ordersQuery } from "../../services/ordersService";
import { Role } from "../../constants/roles";
import OrdersTable from "./OrdersTable";
import { getCreatedDate } from "./orderStatus";

export default function MyOrders() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const uid = user?.uid;
  const isAdmin = profile?.role === Role.Admin;
  const { data, loading, error } = useCollection(() => (uid ? ordersQuery({ uid, isAdmin }) : null), [uid, isAdmin]);
  const [pending, setPending] = useState(null);
  const [deleteFailed, setDeleteFailed] = useState(false);

  // Newest first (users' query has no orderBy to avoid a composite index).
  const orders = useMemo(
    () => [...data].sort((a, b) => (getCreatedDate(b)?.getTime() ?? 0) - (getCreatedDate(a)?.getTime() ?? 0)),
    [data]
  );

  const confirmDelete = async () => {
    const { id } = pending;
    setPending(null);
    try {
      await deleteOrder(id);
      setDeleteFailed(false);
    } catch (err) {
      console.error(err);
      setDeleteFailed(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        {t("orders.title")}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{t("orders.loadError")}</Alert>}
      {deleteFailed && <Alert severity="error" sx={{ mb: 2 }}>{t("orders.deleteError")}</Alert>}
      {loading ? <CircularProgress /> : <OrdersTable orders={orders} onDelete={setPending} />}

      <Dialog open={Boolean(pending)} onClose={() => setPending(null)}>
        <DialogTitle>{t("orders.deleteTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("orders.deleteBody")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPending(null)}>{t("orders.cancel")}</Button>
          <Button color="error" onClick={confirmDelete}>
            {t("Delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
