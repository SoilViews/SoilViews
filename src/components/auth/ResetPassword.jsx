import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import FormCard from "../common/FormCard";
import { emailErrorKey } from "../common/validation";
import { useAuth } from "../../context/AuthContext";
import { resetPassword } from "../../services/authService";

export default function ResetPassword() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/Profile" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setSent(false);
    const key = emailErrorKey(email);
    setError(key ? t(key) : "");
    if (key) return;
    setBusy(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setAuthError(err.message || String(err));
    }
    setBusy(false);
  };

  return (
    <FormCard title={t("Password Reset")} onSubmit={onSubmit}>
      <TextField
        label={t("Email")}
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
        helperText={error}
        fullWidth
      />
      {authError && <Alert severity="error">{authError}</Alert>}
      {sent && <Alert severity="success">{t("ResetEmailSent")}</Alert>}
      <Button type="submit" variant="contained" size="large" disabled={busy}>
        {t("Submit")}
      </Button>
    </FormCard>
  );
}
