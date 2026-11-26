import { useState } from "react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import FormCard from "../common/FormCard";
import { emailErrorKey } from "../common/validation";
import { useAuth } from "../../context/AuthContext";
import { signIn } from "../../services/authService";

export default function SignIn() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    const emailKey = emailErrorKey(form.email);
    if (emailKey) next.email = t(emailKey);
    if (!form.password) next.password = t("PasswordValid");
    setErrors(next);
    setAuthError("");
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await signIn(form.email, form.password);
    } catch (err) {
      setAuthError(err.message || String(err));
      setBusy(false);
    }
  };

  return (
    <FormCard title={`SoilViews ${t("Login")}`} onSubmit={onSubmit}>
      <TextField
        label={t("Email")}
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={onChange}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
      />
      <TextField
        label={t("Password")}
        name="password"
        type="password"
        autoComplete="current-password"
        value={form.password}
        onChange={onChange}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
      />
      {authError && <Alert severity="error">{authError}</Alert>}
      <Button type="submit" variant="contained" size="large" disabled={busy}>
        {t("Login")}
      </Button>
      <Stack direction="row" justifyContent="space-between">
        <Link component={RouterLink} to="/SignUp">{t("Register")}</Link>
        <Link component={RouterLink} to="/ResetPassword">{t("Forgot password?")}</Link>
      </Stack>
    </FormCard>
  );
}
