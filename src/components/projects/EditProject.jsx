import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import FormCard from "../common/FormCard";
import { getProject, updateProject } from "../../services/projectsService";

export default function EditProject() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", authorFirstName: "", authorLastName: "", createdAt: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getProject(id)
      .then((p) => {
        if (cancelled || !p) return;
        setForm({
          title: p.title || "",
          content: p.content || "",
          authorFirstName: p.authorFirstName || "",
          authorLastName: p.authorLastName || "",
          createdAt: p.createdAt?.toDate ? moment(p.createdAt.toDate()).calendar() : "",
        });
      })
      .catch((err) => !cancelled && setError(err.message || String(err)));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Same fields as the legacy form: only title/content change, createdAt is refreshed.
      await updateProject(id, { title: form.title, content: form.content, createdAt: new Date() });
      navigate("/Dashboard");
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  return (
    <FormCard title={t("Edit Project")} maxWidth={640} onSubmit={onSubmit}>
      <Link component={RouterLink} to="/Dashboard">{t("Dashboard")}</Link>
      <TextField label={t("Title")} name="title" value={form.title} onChange={onChange} fullWidth />
      <TextField label={t("Content")} name="content" value={form.content} onChange={onChange} multiline minRows={3} fullWidth />
      <TextField label={t("Author first name")} name="authorFirstName" value={form.authorFirstName} disabled fullWidth />
      <TextField label={t("Author last name")} name="authorLastName" value={form.authorLastName} disabled fullWidth />
      <TextField label={t("Created at")} name="createdAt" value={form.createdAt} disabled fullWidth />
      {error && <Alert severity="error">{error}</Alert>}
      <Button type="submit" variant="contained" size="large">{t("Submit")}</Button>
    </FormCard>
  );
}
