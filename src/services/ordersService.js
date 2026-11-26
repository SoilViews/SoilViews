import {
  collection, addDoc, doc, getDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { serializeShapes } from "../components/dashboard/geo";

// `shapes` (features or FeatureCollection) is stored as a JSON string.
// `extra` holds legacy wizard fields (area + first polygon ring spread as "0","1",...).
export const createOrder = ({ profile, uid, order, extra = {}, shapes }) =>
  addDoc(collection(db, "orders"), {
    authorFirstName: profile.firstName,
    authorLastName: profile.lastName,
    userId: uid,
    createdAt: new Date(),
    order,
    status: [{ value: "Submitted", label: "Submitted" }],
    ...extra,
    ...(shapes ? { shapes: serializeShapes(shapes) } : {}),
  });

export async function getOrder(id) {
  const snap = await getDoc(doc(db, "orders", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Query for useCollection: admins see every order, users only their own.
// (No orderBy for users: avoids needing a composite index; the UI sorts.)
export const ordersQuery = ({ uid, isAdmin }) =>
  isAdmin
    ? query(collection(db, "orders"), orderBy("createdAt", "desc"))
    : query(collection(db, "orders"), where("userId", "==", uid));

export const updateOrder = (id, data) => updateDoc(doc(db, "orders", id), data);

export const deleteOrder = (id) => deleteDoc(doc(db, "orders", id));

export function subscribeOrders({ uid } = {}, cb) {
  const base = collection(db, "orders");
  const q = uid
    ? query(base, where("userId", "==", uid), orderBy("createdAt", "desc"))
    : query(base, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
