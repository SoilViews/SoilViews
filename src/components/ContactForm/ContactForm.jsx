import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import FormCard from "../common/FormCard";
import { emailErrorKey } from "../common/validation";
import { useAuth } from "../../context/AuthContext";
import { sendMessage } from "../../services/projectsService";

export default function ContactForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sendError, setSendError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name) next.name = t("FirstnameValid");
    const emailKey = emailErrorKey(form.email);
    if (emailKey) next.email = t(emailKey);
    if (!form.message) next.message = t("SendMessageContactFormValid");
    setErrors(next);
    setSendError("");
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      // Same document shape as before; author fields are empty for anonymous visitors.
      await sendMessage(form, { profile: profile || {}, uid: user?.uid || null });
      window.alert(t("ContactThanks"));
      navigate("/");
    } catch (err) {
      setSendError(err.message || String(err));
      setBusy(false);
    }
  };

  return (
    <FormCard title={t("Contact Form")} maxWidth={640} onSubmit={onSubmit}>
      <TextField label={t("Name")} name="name" value={form.name} onChange={onChange}
        error={!!errors.name} helperText={errors.name} fullWidth />
      <TextField label={t("Email")} name="email" type="email" value={form.email} onChange={onChange}
        error={!!errors.email} helperText={errors.email} fullWidth />
      <TextField label={t("Message")} name="message" value={form.message} onChange={onChange}
        error={!!errors.message} helperText={errors.message} multiline minRows={4} fullWidth />
      {sendError && <Alert severity="error">{sendError}</Alert>}
      <Button type="submit" variant="contained" size="large" disabled={busy}>{t("Submit")}</Button>
    </FormCard>
  );
}
