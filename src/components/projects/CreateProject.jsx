import { useState } from "react";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import FormCard from "../common/FormCard";
import { useAuth } from "../../context/AuthContext";
import { createProject } from "../../services/projectsService";

export default function CreateProject() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [form, setForm] = useState({ title: "", content: "" });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/SignIn" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.title) next.title = t("TitleValid");
    if (form.content.length < 5) next.content = t("ContentValid");
    setErrors(next);
    setSubmitError("");
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await createProject(form, { profile: profile || {}, uid: user.uid });
      navigate("/Dashboard");
    } catch (err) {
      setSubmitError(err.message || String(err));
      setBusy(false);
    }
  };

  return (
    <FormCard title={t("New Project")} maxWidth={640} onSubmit={onSubmit}>
      <TextField label={t("Title")} name="title" value={form.title} onChange={onChange}
        error={!!errors.title} helperText={errors.title} fullWidth />
      <TextField label={t("Content")} name="content" value={form.content} onChange={onChange}
        error={!!errors.content} helperText={errors.content} multiline minRows={4} fullWidth />
      <Button component="label" variant="outlined">
        {t("Choose or Drop a file here")}
        <input type="file" multiple hidden onChange={(e) => setFiles(Array.from(e.target.files))} />
      </Button>
      {files.length > 0 && (
        <Typography variant="body2" color="text.secondary">{files.map((f) => f.name).join(", ")}</Typography>
      )}
      <Link component={RouterLink} to="/Dashboard" variant="h6">{t("Map your land manually")}</Link>
      {submitError && <Alert severity="error">{submitError}</Alert>}
      <Button type="submit" variant="contained" size="large" disabled={busy}>{t("Create")}</Button>
    </FormCard>
  );
}
