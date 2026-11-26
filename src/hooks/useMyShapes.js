import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useCollection } from "./useCollection";
import { ordersQuery } from "../services/ordersService";
import { toPolygonFeatures } from "../components/dashboard/geo";
import { getCreatedDate, getStatusValue } from "../components/MyOrders/orderStatus";

const isPoint = (p) => Array.isArray(p) && p.length >= 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]);
const toPoint = (p) => (isPoint(p) ? [p[0], p[1]] : Number.isFinite(p?.lng) && Number.isFinite(p?.lat) ? [p.lng, p.lat] : null);

// Legacy orders stored the first ring spread as "0","1",... keys, each a [lng, lat] pair
// (see polygonsCoordinates / handleSubmit in the Wizard).
function legacyFeatures(order) {
  const pts = [];
  for (let i = 0; order[i] !== undefined; i++) {
    const p = toPoint(order[i]);
    if (!p) return [];
    pts.push(p);
  }
  if (pts.length < 3) return [];
  const [f, l] = [pts[0], pts[pts.length - 1]];
  if (f[0] !== l[0] || f[1] !== l[1]) pts.push([...f]);
  return [{ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [pts] } }];
}

function orderFeatures(order) {
  if (typeof order.shapes === "string") {
    try {
      return toPolygonFeatures(JSON.parse(order.shapes));
    } catch {
      return [];
    }
  }
  return legacyFeatures(order);
}

/** The signed-in user's saved shapes (always own orders only, even for admins). */
export function useMyShapes() {
  const { user } = useAuth();
  const uid = user?.uid;
  const { data, loading } = useCollection(() => (uid ? ordersQuery({ uid, isAdmin: false }) : null), [uid]);
  const shapes = useMemo(
    () =>
      data.flatMap((order) => {
        try {
          const createdAt = getCreatedDate(order);
          const status = getStatusValue(order);
          return orderFeatures(order).map((feature) => ({ orderId: order.id, createdAt, status, feature }));
        } catch {
          return [];
        }
      }),
    [data]
  );
  return { shapes, loading };
}
