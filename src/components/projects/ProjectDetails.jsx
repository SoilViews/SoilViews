import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useAuth } from "../../context/AuthContext";
import { getProject } from "../../services/projectsService";

export default function ProjectDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return undefined;
    let cancelled = false;
    getProject(id)
      .then((p) => !cancelled && setProject(p))
      .catch((err) => !cancelled && setError(err.message || String(err)));
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  if (loading) return null;
  if (!user) return <Navigate to="/SignIn" replace />;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!project) {
    return <Container sx={{ py: 4 }}><Typography align="center">{t("Loading project")}</Typography></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>{project.title}</Typography>
          <Typography>{project.content}</Typography>
        </CardContent>
        <CardActions sx={{ flexDirection: "column", alignItems: "flex-start", px: 2, pb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t("Posted by")} {project.authorFirstName} {project.authorLastName}
          </Typography>
          {project.createdAt?.toDate && (
            <Typography variant="body2" color="text.secondary">{moment(project.createdAt.toDate()).calendar()}</Typography>
          )}
        </CardActions>
      </Card>
    </Container>
  );
}
