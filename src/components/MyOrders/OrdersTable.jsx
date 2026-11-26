import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { getCreatedDate, getStatusValue, statusColor, toList } from "./orderStatus";

export default function OrdersTable({ orders, onDelete }) {
  const { t, i18n } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Table aria-label={t("orders.title")}>
        <TableHead>
          <TableRow>
            <TableCell>{t("orders.client")}</TableCell>
            <TableCell>{t("orders.date")}</TableCell>
            <TableCell>{t("orders.crops")}</TableCell>
            <TableCell>{t("orders.area")}</TableCell>
            <TableCell>{t("orders.status")}</TableCell>
            <TableCell align="right">{t("orders.actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => {
            const status = getStatusValue(order);
            const date = getCreatedDate(order);
            return (
              <TableRow key={order.id} hover>
                <TableCell>{order.authorFirstName}</TableCell>
                <TableCell>{date ? date.toLocaleDateString(i18n.language) : ""}</TableCell>
                <TableCell>{toList(order).join(", ")}</TableCell>
                <TableCell>{order.area}</TableCell>
                <TableCell>
                  <Chip size="small" color={statusColor(status)} label={t(`status.${status}`, status)} />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/editOrder/${order.id}`}
                      startIcon={<EditIcon />}
                      title={t("More Info")}
                    >
                      {t("Edit")}
                    </Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(order)}>
                      {t("Delete")}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
          {!orders.length && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography color="text.secondary" sx={{ py: 3 }}>
                  {t("orders.empty")}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
