import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";

/**
 * Selectable list of shapes. groups: [{ key, title, items: [{ id, name, area }] }].
 * selected: Set of ids. onToggle(id), onSetMany(ids, on), onHover(id | null).
 */
export default function ShapeList({ groups, selected, onToggle, onSetMany, onHover }) {
  const { t } = useTranslation();
  const visible = groups.filter((g) => g.items.length);
  const allIds = visible.flatMap((g) => g.items.map((i) => i.id));
  if (!allIds.length) return null;
  const selectedCount = allIds.filter((id) => selected.has(id)).length;
  const all = selectedCount === allIds.length;

  return (
    <Box sx={{ mt: 1, maxHeight: 260, overflowY: "auto", minWidth: 220 }}>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={all}
            indeterminate={selectedCount > 0 && !all}
            onChange={() => onSetMany(allIds, !all)}
          />
        }
        label={t("map.selectAll")}
      />
      {visible.map((g) => (
        <Box key={g.key} component="section">
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
            {g.title}
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
            {g.items.map((item) => (
              <Box
                component="li"
                key={item.id}
                onMouseEnter={() => onHover?.(item.id)}
                onMouseLeave={() => onHover?.(null)}
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, "&:hover": { bgcolor: "action.hover" } }}
              >
                <FormControlLabel
                  sx={{ m: 0, flex: 1 }}
                  control={<Checkbox size="small" checked={selected.has(item.id)} onChange={() => onToggle(item.id)} />}
                  label={item.name}
                />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {item.area}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
