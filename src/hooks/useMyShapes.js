import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useCollection } from "./useCollection";
import { ordersQuery } from "../services/ordersService";
import { orderToFeatures } from "../components/dashboard/geo";
import { getCreatedDate, getStatusValue } from "../components/MyOrders/orderStatus";

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
          return orderToFeatures(order).map((feature) => ({ orderId: order.id, createdAt, status, feature }));
        } catch {
          return [];
        }
      }),
    [data]
  );
  return { shapes, loading };
}
