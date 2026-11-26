import { collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/config";

// Latest notifications for useCollection (same query as the legacy admin panel).
export const notificationsQuery = (max = 5) =>
  query(collection(db, "notifications"), orderBy("time", "desc"), limit(max));
