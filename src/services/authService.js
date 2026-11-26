import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { Role } from "../constants/roles";

export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOut = () => fbSignOut(auth);

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export async function signUp({ email, password, firstName, lastName, telephone, city, imageurl }) {
  const resp = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", resp.user.uid), {
    userId: resp.user.uid,
    firstName,
    lastName,
    initials: firstName[0] + lastName[0],
    email,
    telephone,
    city,
    role: Role.User,
    imageurl,
    createdDate: new Date(),
  });
  return resp.user;
}
