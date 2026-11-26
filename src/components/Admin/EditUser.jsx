import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormCard from "../common/FormCard";
import { emailErrorKey } from "../common/validation";
import { Role } from "../../constants/roles";
import { getUser, updateUser } from "../../services/usersService";
import { uploadFile } from "../../services/storageService";

const empty = { city: "", email: "", firstName: "", lastName: "", telephone: "", imageurl: "", role: "" };

export default function EditUser() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [initials, setInitials] = useState("");
  const [status, setStatus] = useState("loading"); // loading | ready | notFound
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [uploadError, setUploadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getUser(id)
      .then((u) => {
        if (cancelled) return;
        if (!u) return setStatus("notFound");
        setForm({
          city: u.city ?? "",
          email: u.email ?? "",
          firstName: u.firstName ?? "",
          lastName: u.lastName ?? "",
          telephone: u.telephone ?? "",
          imageurl: u.imageurl ?? "",
          role: u.role ?? "",
        });
        setInitials(u.initials ?? "");
        setStatus("ready");
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setStatus("notFound");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.firstName) e.firstName = t("FirstnameValid");
    if (!form.lastName) e.lastName = t("LastnameValid");
    if (!form.city) e.city = t("CityValid");
    if (!form.telephone) e.telephone = t("EmptyTelephonValidation");
    else if (form.telephone.length < 10) e.telephone = t("Telephon validation");
    const key = emailErrorKey(form.email);
    if (key) e.email = t(key);
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    setSaveError(false);
    const { city, email, firstName, lastName, telephone, imageurl, role } = form;
    try {
      await updateUser(id, { city, email, firstName, lastName, telephone, imageurl, ...(role ? { role } : {}) });
      navigate("/AdminPanel");
    } catch (err) {
      console.error(err);
      setSaveError(true);
      setSaving(false);
    }
  };

  const onUpload = async () => {
    if (!file) return;
    setUploadError(false);
    setProgress(0);
    try {
      const url = await uploadFile(`UploadedFiles/${form.firstName}_${file.name}`, file, setProgress);
      setForm((f) => ({ ...f, imageurl: url }));
    } catch (err) {
      console.error(err);
      setUploadError(true);
    }
  };

  if (status === "loading") return <CircularProgress sx={{ m: 4 }} />;
  if (status === "notFound") {
    return (
      <FormCard title={t("admin.editUser")} component="div">
        <Alert severity="warning">{t("admin.userNotFound")}</Alert>
        <Button component={RouterLink} to="/AdminPanel">{t("admin.back")}</Button>
      </FormCard>
    );
  }

  return (
    <FormCard title={t("admin.editUser")} onSubmit={onSubmit} maxWidth={560}>
      <Button component={RouterLink} to="/AdminPanel" sx={{ alignSelf: "flex-start" }}>
        {t("admin.back")}
      </Button>
      <TextField name="city" label={t("City")} value={form.city} onChange={onChange} error={!!errors.city} helperText={errors.city} />
      <TextField name="email" label={t("Email")} value={form.email} onChange={onChange} error={!!errors.email} helperText={errors.email} />
      <TextField name="firstName" label={t("FirstName")} value={form.firstName} onChange={onChange} error={!!errors.firstName} helperText={errors.firstName} />
      <TextField name="lastName" label={t("LastName")} value={form.lastName} onChange={onChange} error={!!errors.lastName} helperText={errors.lastName} />
      <TextField name="telephone" label={t("Telephone")} value={form.telephone} onChange={onChange} error={!!errors.telephone} helperText={errors.telephone} />
      <TextField select name="role" label={t("admin.role")} value={form.role} onChange={onChange}>
        {Object.values(Role).map((r) => (
          <MenuItem key={r} value={r}>{r}</MenuItem>
        ))}
      </TextField>
      <Typography variant="body2" color="text.secondary">
        {t("admin.initials")}: {initials}
      </Typography>

      <Typography variant="h6">{t("admin.fileUploader")}</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar variant="rounded" src={form.imageurl || undefined} alt={t("admin.image")} sx={{ width: 96, height: 96 }} />
        <Stack spacing={1}>
          <Button variant="outlined" component="label">
            {file ? file.name : t("admin.selectFile")}
            <input hidden type="file" onChange={(e) => setFile(e.target.files[0] ?? null)} />
          </Button>
          <Button onClick={onUpload} disabled={!file || (progress !== null && progress < 100 && !uploadError)}>
            {t("admin.upload")}
          </Button>
        </Stack>
      </Stack>
      {progress !== null && <LinearProgress variant="determinate" value={progress} />}
      {uploadError && <Alert severity="error">{t("admin.uploadError")}</Alert>}

      {saveError && <Alert severity="error">{t("admin.saveError")}</Alert>}
      <Button type="submit" variant="contained" disabled={saving}>
        {t("Submit")}
      </Button>
    </FormCard>
  );
}
