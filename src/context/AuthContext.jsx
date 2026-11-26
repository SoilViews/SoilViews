import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { getUser } from "../services/usersService";

const AuthContext = createContext({ user: null, profile: null, loading: true });

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, profile: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (!cancelled) setState({ user: null, profile: null, loading: false });
        return;
      }
      if (!cancelled) setState((s) => ({ ...s, user, loading: true }));
      let profile = null;
      try {
        profile = await getUser(user.uid);
      } catch (e) {
        console.error("Failed to load profile", e);
      }
      if (!cancelled) setState({ user, profile, loading: false });
    });
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
