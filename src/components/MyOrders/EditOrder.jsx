import { useEffect, useMemo, useState } from "react";
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
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormCard from "../common/FormCard";
import { useAuth } from "../../context/AuthContext";
import { Role } from "../../constants/roles";
import MapView from "../dashboard/MapView";
import { orderToFeatures, polygonsArea } from "../dashboard/geo";
import { getOrder, updateOrder, buildShapeUpdate } from "../../services/ordersService";
import { CROPS } from "../Wizard/crops";
import { STATUS_OPTIONS, getStatusValue, toList } from "./orderStatus";

export default function EditOrder() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [state, setState] = useState({ loading: true, found: false, crops: [], status: "Submitted" });
  const [order, setOrder] = useState(null);
  const [features, setFeatures] = useState([]);
  const [noShape, setNoShape] = useState(false);
  // Loaded once with the order; MapView ignores later identity changes anyway.
  const initialFeatures = useMemo(() => (order ? orderToFeatures(order) : []), [order]);
  const canEditShape =
    profile?.role === Role.Admin || (Boolean(order) && order.userId === user?.uid && getStatusValue(order) === "Submitted");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrder(id)
      .then((order) => {
        if (cancelled) return;
        setOrder(order);
        setFeatures(order ? orderToFeatures(order) : []);
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
    if (canEditShape && !features.length) {
      setNoShape(true);
      return;
    }
    setNoShape(false);
    setSaving(true);
    setError(false);
    try {
      // Same shape createOrder writes: status is a one-element [{value,label}] array.
      await updateOrder(id, {
        order: state.crops,
        status: [{ value: state.status, label: state.status }],
        ...(canEditShape ? buildShapeUpdate(order, features) : {}),
      });
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
    <FormCard title={t("orders.edit.title")} onSubmit={handleSubmit} maxWidth={900}>
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
          <Box>
            <FormLabel component="legend">{t("orders.edit.map")}</FormLabel>
            {!canEditShape && (
              <Alert severity="info" sx={{ my: 1 }}>
                {t("orders.edit.readOnly")}
              </Alert>
            )}
            {noShape && (
              <Alert severity="error" sx={{ my: 1 }}>
                {t("orders.edit.noShape")}
              </Alert>
            )}
            {/* MapView is absolutely positioned: give it a sized, positioned parent. */}
            <Box sx={{ position: "relative", height: 420, mt: 1 }}>
              <MapView editable={canEditShape} initialFeatures={initialFeatures} onPolygonsChange={setFeatures} />
            </Box>
            {polygonsArea(features) && (
              <Typography sx={{ mt: 1 }}>
                {t("orders.edit.area")}: {polygonsArea(features)}
              </Typography>
            )}
          </Box>
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
