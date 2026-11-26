import { collection, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export async function getUser(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export const updateUser = (uid, data) => updateDoc(doc(db, "users", uid), data);

export function subscribeUsers(cb) {
  return onSnapshot(collection(db, "users"), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

// Collection reference for useCollection.
export const usersQuery = () => collection(db, "users");
