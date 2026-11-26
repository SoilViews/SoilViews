import { Navigate, Outlet, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAuth } from "../../context/AuthContext";

export default function RequireAuth({ roles, children }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user) return <Navigate to="/SignIn" replace state={{ from: location }} />;
  if (roles && !roles.includes(profile?.role)) return <Navigate to="/" replace />;
  return children ?? <Outlet />;
}
