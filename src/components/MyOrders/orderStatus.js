export const STATUS_OPTIONS = ["Submitted", "In progress", "Completed"];

// `status` is stored as [{value,label}] by createOrder, but older edits stored a bare {value,label}.
export function getStatusValue(order) {
  const s = order?.status;
  if (Array.isArray(s)) return s[0]?.value ?? "Submitted";
  if (s && typeof s === "object") return s.value ?? "Submitted";
  return s || "Submitted";
}

export const statusColor = (value) =>
  value === "Completed" ? "success" : value === "In progress" ? "info" : "warning";

export function getCreatedDate(order) {
  const c = order?.createdAt;
  const d = c?.toDate ? c.toDate() : c instanceof Date ? c : c ? new Date(c) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
}

export const toList = (order) => (Array.isArray(order?.order) ? order.order : order?.order ? [order.order] : []);
