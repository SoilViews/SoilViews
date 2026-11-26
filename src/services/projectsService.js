import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const author = ({ profile, uid }) => ({
  authorFirstName: profile.firstName,
  authorLastName: profile.lastName,
  authorId: uid,
  createdAt: new Date(),
});

export const createProject = (project, ctx) =>
  addDoc(collection(db, "projects"), { ...project, ...author(ctx) });

export const deleteProject = (id) => deleteDoc(doc(db, "projects", id));

export const updateProject = (id, data) => updateDoc(doc(db, "projects", id), data);

export async function getProject(id) {
  const snap = await getDoc(doc(db, "projects", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export const sendMessage = (message, ctx) =>
  addDoc(collection(db, "messages"), { ...message, ...author(ctx) });

export const saveCoordinates = (coords, ctx) =>
  addDoc(collection(db, "cordinates"), { ...author(ctx), ...coords });
