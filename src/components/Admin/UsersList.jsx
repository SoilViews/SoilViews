import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";

export default function UsersList({ users }) {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper}>
      <Table aria-label={t("admin.users")}>
        <TableHead>
          <TableRow>
            <TableCell>{t("City")}</TableCell>
            <TableCell>{t("Email")}</TableCell>
            <TableCell>{t("FirstName")}</TableCell>
            <TableCell>{t("admin.initials")}</TableCell>
            <TableCell>{t("LastName")}</TableCell>
            <TableCell>{t("admin.role")}</TableCell>
            <TableCell align="right">{t("orders.actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>{user.city}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.initials}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell align="right">
                <Button size="small" component={RouterLink} to={`/edit/${user.id}`} startIcon={<EditIcon />}>
                  {t("Edit")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!users.length && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography color="text.secondary" sx={{ py: 3 }}>
                  {t("admin.noUsers")}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
