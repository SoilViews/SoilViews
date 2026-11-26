import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OrdersTable from "../MyOrders/OrdersTable";
import { getCreatedDate } from "../MyOrders/orderStatus";
import { deleteOrder } from "../../services/ordersService";

// Admin view of all orders with delete confirmation.
export default function OrdersList({ orders }) {
  const { t } = useTranslation();
  const [pending, setPending] = useState(null);
  const [failed, setFailed] = useState(false);

  const sorted = useMemo(
    () => [...orders].sort((a, b) => (getCreatedDate(b)?.getTime() ?? 0) - (getCreatedDate(a)?.getTime() ?? 0)),
    [orders]
  );

  const confirmDelete = async () => {
    const { id } = pending;
    setPending(null);
    try {
      await deleteOrder(id);
      setFailed(false);
    } catch (err) {
      console.error(err);
      setFailed(true);
    }
  };

  return (
    <>
      {failed && <Alert severity="error" sx={{ mb: 2 }}>{t("orders.deleteError")}</Alert>}
      <OrdersTable orders={sorted} onDelete={setPending} />
      <Dialog open={Boolean(pending)} onClose={() => setPending(null)}>
        <DialogTitle>{t("orders.deleteTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("orders.deleteBody")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPending(null)}>{t("orders.cancel")}</Button>
          <Button color="error" onClick={confirmDelete}>{t("Delete")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
