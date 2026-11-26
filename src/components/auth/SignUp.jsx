import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import FormCard from "../common/FormCard";
import { emailErrorKey } from "../common/validation";
import { useAuth } from "../../context/AuthContext";
import { signUp } from "../../services/authService";

const empty = { firstName: "", lastName: "", city: "", telephone: "", email: "", password: "" };

export default function SignUp() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/Dashboard" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.firstName) e.firstName = t("FirstnameValid");
    if (!form.lastName) e.lastName = t("LastnameValid");
    if (!form.city) e.city = t("CityValid");
    if (!form.telephone) e.telephone = t("EmptyTelephonValidation");
    else if (form.telephone.length < 10) e.telephone = t("Telephon validation");
    const emailKey = emailErrorKey(form.email);
    if (emailKey) e.email = t(emailKey);
    if (form.password.length < 6) e.password = t("PasswordValid");
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const next = validate();
    setErrors(next);
    setAuthError("");
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await signUp({ ...form, imageurl: "" });
    } catch (err) {
      setAuthError(err.message || String(err));
      setBusy(false);
    }
  };

  const field = (name, label, extra = {}) => (
    <TextField
      label={label}
      name={name}
      value={form[name]}
      onChange={onChange}
      error={!!errors[name]}
      helperText={errors[name]}
      fullWidth
      {...extra}
    />
  );

  return (
    <FormCard title={t("Register")} onSubmit={onSubmit}>
      {field("firstName", t("FirstName"), { autoComplete: "given-name" })}
      {field("lastName", t("LastName"), { autoComplete: "family-name" })}
      {field("city", t("City"), { autoComplete: "address-level2" })}
      {field("telephone", t("Telephone"), { type: "tel", autoComplete: "tel" })}
      {field("email", t("Email"), { type: "email", autoComplete: "email" })}
      {field("password", t("Password"), { type: "password", autoComplete: "new-password" })}
      {authError && <Alert severity="error">{authError}</Alert>}
      <Button type="submit" variant="contained" size="large" disabled={busy}>
        {t("Register")}
      </Button>
    </FormCard>
  );
}
