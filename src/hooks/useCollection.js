import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";

/**
 * Live Firestore subscription.
 * queryFactory returns a Firestore query/collection reference (or null to skip).
 */
export function useCollection(queryFactory, deps = []) {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    const q = queryFactory();
    if (!q) {
      setState({ data: [], loading: false, error: null });
      return undefined;
    }
    setState((s) => ({ ...s, loading: true }));
    return onSnapshot(
      q,
      (snap) =>
        setState({
          data: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
          loading: false,
          error: null,
        }),
      (error) => setState({ data: [], loading: false, error })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
