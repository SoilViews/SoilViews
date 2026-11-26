import L from "leaflet";
import "leaflet-draw";

// Translate leaflet-draw's toolbar and tooltips. Mutates L.drawLocal in place (the toolbar reads it
// when a Draw control is constructed, so call this just before `new L.Control.Draw`).
export function applyDrawLocale(t) {
  const d = L.drawLocal;
  d.draw.toolbar.actions = { title: t("draw.cancel.title"), text: t("draw.cancel.text") };
  d.draw.toolbar.finish = { title: t("draw.finish.title"), text: t("draw.finish.text") };
  d.draw.toolbar.undo = { title: t("draw.undo.title"), text: t("draw.undo.text") };
  d.draw.toolbar.buttons.polygon = t("draw.polygon");
  d.draw.handlers.polygon.tooltip = {
    start: t("draw.tooltip.start"),
    cont: t("draw.tooltip.cont"),
    end: t("draw.tooltip.end"),
  };
  d.draw.handlers.polyline.error = `<strong>${t("draw.error")}</strong>`;
  d.edit.toolbar.actions = {
    save: { title: t("draw.edit.save.title"), text: t("draw.edit.save.text") },
    cancel: { title: t("draw.edit.cancel.title"), text: t("draw.edit.cancel.text") },
    clearAll: { title: t("draw.edit.clearAll.title"), text: t("draw.edit.clearAll.text") },
  };
  d.edit.toolbar.buttons = {
    edit: t("draw.edit.edit"),
    editDisabled: t("draw.edit.editDisabled"),
    remove: t("draw.edit.remove"),
    removeDisabled: t("draw.edit.removeDisabled"),
  };
  d.edit.handlers.edit.tooltip = { text: t("draw.edit.tooltip.text"), subtext: t("draw.edit.tooltip.subtext") };
  d.edit.handlers.remove.tooltip = { text: t("draw.remove.tooltip") };
}
