import { useMemo, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";

import data from "../../data/ekate.json";
import haskovoArrays from "../../data/masivi_haskovo.json";

const unique = (list) => [...new Set(list)];
const HASKOVO = "Хасково";
// ekate.json stores "lng,lat"; Leaflet wants [lat, lng].
const parseGeo = (geo) => {
  const [lng, lat] = String(geo).split(",").map(Number);
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
};

// Most specific selection wins.
const geoFor = (province, mun, settlement) => {
  let rows = [];
  if (province && !mun) rows = data.filter((x) => x.province === province && x.settlement === province);
  else if (province && mun && !settlement) rows = data.filter((x) => x.municipality === mun && x.settlement === mun);
  else if (settlement) rows = data.filter((x) => x.settlement === settlement && x.municipality === mun);
  return rows.length ? rows[0].geo : "";
};

const Field = ({ label, value, onChange, options, disabled }) => (
  <Grid size={{ xs: 12, sm: 6, md: "auto" }}>
    <FormControl size="small" sx={{ minWidth: 150 }} fullWidth disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={onChange}>
        {options.map((o) => (
          <MenuItem key={o} value={o}>
            {o}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
);

// Region -> municipality -> settlement -> EKATTE drill-down. Calls onLocate([lat, lng]) so the map can fly there.
export default function Step2({ onLocate }) {
  const { t } = useTranslation();
  const [sel, setSel] = useState({ province: "", mun: "", settlement: "", ekatte: "", haskArray: "" });

  const provinces = useMemo(() => unique(data.map((i) => i.province)), []);
  const muns = useMemo(() => unique(data.filter((i) => i.province === sel.province).map((i) => i.municipality)), [sel.province]);
  const settlements = useMemo(
    () => unique(data.filter((i) => i.municipality === sel.mun).map((i) => i.settlement)),
    [sel.mun]
  );
  const ekattes = useMemo(
    () => data.filter((i) => i.settlement === sel.settlement && i.municipality === sel.mun).map((i) => i.ekatte),
    [sel.settlement, sel.mun]
  );

  const findGeo = geoFor(sel.province, sel.mun, sel.settlement);

  const haskGeo = useMemo(() => {
    const row = haskovoArrays.find((x) => x.masiv === sel.haskArray);
    return row ? `${row.point_y},${row.point_x}` : "";
  }, [sel.haskArray]);

  const update = (patch, geo) => {
    setSel((s) => ({ ...s, ...patch }));
    const ll = geo && parseGeo(geo);
    if (ll && onLocate) onLocate(ll);
  };

  return (
    <div>
      <Typography variant="h6" component="h2" gutterBottom>
        {t("wizard.land.title")}
      </Typography>
      <Typography variant="body2" component="div" sx={{ mb: 2 }}>
        <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
          <li>{t("wizard.land.hint1")}</li>
          <li>{t("wizard.land.hint2")}</li>
        </ul>
      </Typography>
      <Grid container spacing={1.5}>
        <Field
          label={t("geo.region")}
          value={sel.province}
          options={provinces}
          onChange={(e) =>
            update({ province: e.target.value, mun: "", settlement: "", ekatte: "", haskArray: "" }, geoFor(e.target.value, "", ""))
          }
        />
        <Field
          label={t("geo.municipality")}
          value={sel.mun}
          options={muns}
          disabled={!sel.province}
          onChange={(e) =>
            update({ mun: e.target.value, settlement: "", ekatte: "", haskArray: "" }, geoFor(sel.province, e.target.value, ""))
          }
        />
        <Field
          label={t("geo.settlement")}
          value={sel.settlement}
          options={settlements}
          disabled={!sel.mun}
          onChange={(e) =>
            update({ settlement: e.target.value, ekatte: "", haskArray: "" }, geoFor(sel.province, sel.mun, e.target.value))
          }
        />
        <Field
          label={t("geo.ekatte")}
          value={sel.ekatte}
          options={ekattes}
          disabled={!sel.settlement}
          onChange={(e) => update({ ekatte: e.target.value, haskArray: "" })}
        />
        {sel.province === HASKOVO && (
          <Field
            label={t("geo.array")}
            value={sel.haskArray}
            options={haskovoArrays.map((i) => i.masiv)}
            onChange={(e) => {
              const row = haskovoArrays.find((x) => x.masiv === e.target.value);
              update({ haskArray: e.target.value }, row && `${row.point_x},${row.point_y}`);
            }}
          />
        )}
      </Grid>
      {findGeo && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {t("geo.coords")} {findGeo}
        </Typography>
      )}
      {sel.haskArray && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {t("geo.haskArray")} {haskGeo}
        </Typography>
      )}
    </div>
  );
}
