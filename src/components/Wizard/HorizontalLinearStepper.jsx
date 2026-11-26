import { useCallback, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/ordersService";
import { useMyShapes } from "../../hooks/useMyShapes";
import MapView from "../dashboard/MapView";
import { polygonsArea, polygonsCoordinates } from "../dashboard/geo";
import Alert from "./Alert";
import AlertNoPoly from "./AlertNoPoly";
import { NewCheckboxes } from "./NewCheckBoxes";
import { SelectedCropsCards } from "./SelectedCropsCards";
import Step2 from "./Step2";
import { CROPS, initialCrops } from "./crops";

const STEP_KEYS = ["wizard.step.start", "wizard.step.land", "wizard.step.crops", "wizard.step.confirm"];
const PANEL_WIDTH = 440;
const EMAIL_SERVER = import.meta.env.VITE_EMAIL_SERVER_URL || "http://127.0.0.1:4000";

function sendEmail(recipient) {
  const params = new URLSearchParams({
    recipient: recipient || "",
    sender: "alexander.velchev@mail.bg",
    topic: "OrderSubmitted",
    text: "Your order is submitted",
  });
  return fetch(`${EMAIL_SERVER}/Dashboard?${params}`).catch((err) => console.error(err));
}

const HorizontalLinearStepper = () => {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const { shapes: savedShapes } = useMyShapes();
  const [activeStep, setActiveStep] = useState(0);
  const [polygons, setPolygons] = useState([]);
  const [crops, setCrops] = useState(initialCrops);
  const [flyTo, setFlyTo] = useState(null);
  const [mapKey, setMapKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const canOrder = profile?.role === "User" || profile?.role === "Admin";
  const selectedCrops = useMemo(() => CROPS.filter((c) => crops[c]), [crops]);
  const area = useMemo(() => polygonsArea(polygons), [polygons]);
  const coordinates = useMemo(() => polygonsCoordinates(polygons), [polygons]);
  const location = useMemo(
    () =>
      polygons
        .map((f) => f.geometry.coordinates[0]?.[0])
        .filter(Boolean)
        .map(([lng, lat]) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        .join("; "),
    [polygons]
  );
  const done = activeStep === STEP_KEYS.length;

  const handlePolygons = useCallback((features) => setPolygons(features), []);
  const handleCropChange = (e) => setCrops((c) => ({ ...c, [e.target.name]: e.target.checked }));
  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  const handleReset = () => {
    setCrops(initialCrops());
    setPolygons([]);
    setMapKey((k) => k + 1);
    setSubmitError(false);
    setActiveStep(0);
  };

  // Doc shape is unchanged from the legacy wizard: area + first ring spread as "0","1",... keys.
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(false);
    try {
      await createOrder({
        profile,
        uid: user.uid,
        order: selectedCrops,
        extra: { area, ...coordinates[0] },
        shapes: polygons,
      });
      sendEmail(profile.email);
      setCrops(initialCrops());
      handleNext();
    } catch (err) {
      console.error(err);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const nextDisabled = (activeStep === 0 && !canOrder) || (activeStep === 1 && !polygons.length) || (activeStep === 2 && !selectedCrops.length);

  const content = () => {
    switch (activeStep) {
      case 0:
        return canOrder ? (
          <Stack spacing={1}>
            <Typography variant="h5" component="h2">
              {t("wizard.intro.title")}
            </Typography>
            {[1, 2, 3, 4].map((n) => (
              <Typography key={n}>{t(`wizard.intro.${n}`)}</Typography>
            ))}
          </Stack>
        ) : (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <Button component={RouterLink} to="/SignIn" startIcon={<LockIcon />}>
              {t("Please login to continue")}
            </Button>
          </Box>
        );
      case 1:
        return (
          <>
            <AlertNoPoly show={!polygons.length} />
            <Step2 onLocate={setFlyTo} />
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              {t("wizard.crops.title")}
            </Typography>
            <Alert show={!selectedCrops.length} />
            <NewCheckboxes crops={crops} handleCropChange={handleCropChange} />
          </>
        );
      case 3:
        return (
          <>
            {submitError && (
              <MuiAlert severity="error" sx={{ mb: 2 }}>
                {t("wizard.submitError")}
              </MuiAlert>
            )}
            <SelectedCropsCards selectedCrops={selectedCrops} area={area} location={location} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
        minHeight: 480,
        // Keep Leaflet's top-left tools clear of the floating panel on wide screens.
        "& .leaflet-top.leaflet-left": { left: { md: PANEL_WIDTH + 32 } },
      }}
    >
      <MapView key={mapKey} onPolygonsChange={handlePolygons} editable={activeStep === 1} flyTo={flyTo} savedShapes={savedShapes} />
      <Paper
        elevation={6}
        sx={{
          position: "absolute",
          zIndex: 1100,
          top: { xs: "auto", md: 16 },
          bottom: { xs: 0, md: "auto" },
          left: { xs: 0, md: 16 },
          width: { xs: "100%", md: PANEL_WIDTH },
          maxHeight: { xs: "55%", md: "calc(100% - 32px)" },
          overflowY: "auto",
          p: 2,
          borderRadius: { xs: "12px 12px 0 0", md: undefined },
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
          {STEP_KEYS.map((key) => (
            <Step key={key}>
              <StepLabel>{t(key)}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {done ? (
          <Stack spacing={2}>
            <div>
              <Typography variant="h6" component="h2">
                {t("wizard.completed")}
              </Typography>
              <Typography>{t("wizard.completedHint")}</Typography>
            </div>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={handleReset}>
                {t("wizard.newOrder")}
              </Button>
              <Button variant="contained" component={RouterLink} to="/MyOrders">
                {t("wizard.myOrders")}
              </Button>
            </Stack>
          </Stack>
        ) : (
          <>
            {content()}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {activeStep > 0 && (
                <Button onClick={handleBack} disabled={submitting}>
                  {t("wizard.back")}
                </Button>
              )}
              {activeStep === 3 ? (
                <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
                  {t("wizard.submit")}
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext} disabled={nextDisabled}>
                  {activeStep === 0 ? t("wizard.start") : t("wizard.next")}
                </Button>
              )}
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default HorizontalLinearStepper;
