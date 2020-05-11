import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { saveOrderData } from "../../store/actions/newOrder";
import { Link } from "react-router-dom";
import Alert from "./Alert";
import { NewCheckboxes } from "./NewCheckBoxes";
import { SelectedCropsCards } from "./SelectedCropsCards";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));
//step names
function getSteps() {
  return [
    "View block and satelite image",
    "Choose rate and draw",
    "Choose your preferred crops",
    "Confirm your selected crops",
  ];
}

function HorizontalLinearStepper(props) {
  const classes = useStyles();
  const [errorStatus, setErrorStatus] = React.useState(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();
  const initialCrops = {
    Fruits: false,
    Vegetables: false,
    Protein: false,
    Grains: false,
    Vines: false,
    Berries: false,
  };
  const [crops, setCrops] = React.useState( initialCrops );

  const handleCropChange = (event) => {
    setCrops({ ...crops, [event.target.name]: event.target.checked });
  };

  const handleResetCrops = () => {
    setCrops(initialCrops);
  };

  //STEPPER FUNCTIONALITY***************
  const isStepOptional = (step) => {
    return step === 1;
  };
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const handleNext = () => {
    //get boxes
    const selectedCrops = Object.keys(crops).filter((crop) => crops[crop]);
    if (activeStep === 2 && selectedCrops.length < 1) {
      setErrorStatus({ msg: "Must Select one crop", type: "Warning" });
    } else {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  //SAVE TO FIREBASE
  //CHANGE HERE
  const Save = () => {
    const selectedCrops = Object.keys(crops).filter((crop) => crops[crop]);
    props.saveOrderData(selectedCrops);
    console.log("Database updated, Moving to next step");
    handleResetCrops();
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //STEPPER FUNCTIONALITY***************
  function getStepContent(step) {
    const selectedCrops = Object.keys(crops).filter((crop) => crops[crop]);
    switch (step) {
      case 0:
        return (
          <div>
            <h3>Map your crop from satellite</h3>
            <p>
              Use satellite imagery to visualise the crop variation within your
              fields. Furthermore, you can easily create variation maps and
              prescription files to control the application rate of your
              fertilizer spreader or sprayer. Zoom into your field by using the
              search box to find your location! The background map is there to
              help you find your field and has nothing to do with current
              satellite imagery.
            </p>
          </div>
        );
      case 1:
        return (
          <ol>
            <h3>Find your block and chose satellite image</h3>
            <li>
              Find the parcel you would like to have a closer look at. Enter the
              location in the search field at the top left. You can also zoom in
              and out by using the + and - buttons and navigate by dragging the
              map to where you want to go.
            </li>
            <li>Draw one or more parcels in the background map</li>
            <li>When you have selected parcels, click on Save</li>
          </ol>
        );
      case 2:
        return (
          <div>
            <Alert errorStatus={errorStatus} />
            <NewCheckboxes handleCropChange={handleCropChange} crops={crops} />
          </div>
        );
      case 3:
        return <SelectedCropsCards selectedCrops={selectedCrops} />;
      default:
        return "Unknown step";
    }
  }
  const mapEvent = (e) => {
    var ee = document.createEvent("Event");
    ee.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-draw-polygon");
    return !cb[0].dispatchEvent(ee);
  };
  //STEPPER FUNCTIONALITY***************
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography component="span" variant="caption">
                Optional
              </Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography component="span" className={classes.instructions}>
              Your order was completed. <br />
              You may track its process on "My orders" page.
            </Typography>
            <br />
            <br />
            <Button
              onClick={handleReset}
              className={classes.button}
              variant="contained"
            >
              New Order
            </Button>
            <Button
              // onClick={}
              className={classes.button}
              variant="contained"
              color="primary"
            >
              {/* TODO Link TO MY ORDERS PAGE */}
              <Link style={{ color: "white" }} to="/MyOrders">
                My Orders
              </Link>
            </Button>
          </div>
        ) : (
          <div>
            <Typography component="span" className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <Button
                style={{
                  ...(activeStep === 0 ? { display: "none" } : {}),
                }}
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>

              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    mapEvent(e);
                  }}
                  className={classes.button}
                >
                  Draw a polygon
                </Button>
              )}
              <Button
                style={{ ...(activeStep !== 3 ? { display: "none" } : {}) }}
                disabled={activeStep === 0}
                onClick={Save}
                className={classes.button}
                variant="contained"
                color="primary"
              >
                Review and Submit
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
                style={{
                  ...(activeStep === 3 ? { display: "none" } : {}),
                }}
              >
                {activeStep === steps.length - 1
                  ? // ? "Finish"
                    // : activeStep
                    // === 0
                    "Start"
                  : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    saveOrderData: (selectedBoxes) => dispatch(saveOrderData(selectedBoxes)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HorizontalLinearStepper);
