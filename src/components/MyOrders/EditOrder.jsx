import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import FormCard from "../common/FormCard";
import { getOrder, updateOrder } from "../../services/ordersService";
import { CROPS } from "../Wizard/crops";
import { STATUS_OPTIONS, getStatusValue, toList } from "./orderStatus";

export default function EditOrder() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, found: false, crops: [], status: "Submitted" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrder(id)
      .then((order) => {
        if (cancelled) return;
        setState(
          order
            ? { loading: false, found: true, crops: toList(order), status: getStatusValue(order) }
            : { loading: false, found: false, crops: [], status: "Submitted" }
        );
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setState({ loading: false, found: false, crops: [], status: "Submitted" });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const toggleCrop = (crop) =>
    setState((s) => ({ ...s, crops: s.crops.includes(crop) ? s.crops.filter((c) => c !== crop) : [...s.crops, crop] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(false);
    try {
      // Same shape createOrder writes: status is a one-element [{value,label}] array.
      await updateOrder(id, { order: state.crops, status: [{ value: state.status, label: state.status }] });
      navigate("/MyOrders");
    } catch (err) {
      console.error(err);
      setError(true);
      setSaving(false);
    }
  };

  if (state.loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 6 }} />;
  }

  return (
    <FormCard title={t("orders.edit.title")} onSubmit={handleSubmit} maxWidth={520}>
      <Button component={RouterLink} to="/MyOrders" sx={{ alignSelf: "flex-start" }}>
        {t("orders.edit.back")}
      </Button>
      {!state.found ? (
        <Alert severity="warning">{t("orders.edit.notFound")}</Alert>
      ) : (
        <>
          {error && <Alert severity="error">{t("orders.edit.saveError")}</Alert>}
          <FormControl component="fieldset">
            <FormLabel component="legend">{t("orders.edit.crops")}</FormLabel>
            <FormGroup>
              {CROPS.map((crop) => (
                <FormControlLabel
                  key={crop}
                  control={<Checkbox checked={state.crops.includes(crop)} onChange={() => toggleCrop(crop)} />}
                  label={t(`crop.${crop}`)}
                />
              ))}
            </FormGroup>
          </FormControl>
          <TextField
            select
            label={t("orders.edit.status")}
            value={state.status}
            onChange={(e) => setState((s) => ({ ...s, status: e.target.value }))}
          >
            {STATUS_OPTIONS.map((o) => (
              <MenuItem key={o} value={o}>
                {t(`status.${o}`)}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" justifyContent="flex-end">
            <Button type="submit" variant="contained" disabled={saving}>
              {t("orders.edit.save")}
            </Button>
          </Stack>
        </>
      )}
    </FormCard>
  );
}
