import React from "react";
import {
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@material-ui/core/";
import { connect } from "react-redux";
import { saveOrderData } from "../../store/actions/newOrder";
import { Link } from "react-router-dom";
import Alert from "./Alert";
import { NewCheckboxes } from "./NewCheckBoxes";
import { SelectedCropsCards } from "./SelectedCropsCards";
import firebase from "../../firebase";
//Stepper Styles
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
//Step names
function getSteps() {
  return [
    "Start",
    "Map your Land",
    "Choose preferred crops",
    "Confirm your order",
  ];
}
const HorizontalLinearStepper = (props) => {
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

  const [crops, setCrops] = React.useState(initialCrops);

  const handleCropChange = (event) => {
    setCrops({ ...crops, [event.target.name]: event.target.checked });
  };

  const handleResetCrops = () => {
    setCrops(initialCrops);
  };

  //GETS THE LAND AREA
  const getArea = props.area;
  //GETS THE LAND COORDINATES
  const getLandCoordinates = props.coordinates;

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
    // const selectedCrops = Object.keys(crops).filter((crop) => crops[crop]);
    console.log(getLandCoordinates);
    console.log(getArea);
    const db = firebase.firestore();
    db.collection("orders").add({
      authorFirstName: props.profile.firstName,
      authorLastName: props.profile.lastName,
      userId: props.auth,
      area: getArea,
      createdAt: new Date(),
      ...getLandCoordinates[0],
    });
    handleResetCrops();
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //STEPPER CONTENT***************
  function getStepContent(step) {
    const selectedCrops = Object.keys(crops).filter((crop) => crops[crop]);
    switch (step) {
      case 0:
        return (
          <div style={{ padding: "2% 0" }}>
            <Typography variant="h4">Submit your order in few steps</Typography>
            <Typography variant="h6">Find your land on the map</Typography>
            <Typography variant="h6">
              Mark it using the tools or upload a file
            </Typography>
            <Typography variant="h6">Select preferred crops</Typography>
            <Typography variant="h6">Get your results</Typography>
          </div>
        );
      case 1:
        return (
          <div style={{ padding: "2% 0" }}>
            <Typography variant="h4">Find your land on the map</Typography>
            <ul>
              <li>
                Find your land on the map and mark it using the map tools.
              </li>
              <li>Or upload a digital file of your land</li>
            </ul>
            <p>
              Your area is:
              {getArea}
            </p>
            <p key={getLandCoordinates}>
              Your Coordinates are:
              {getLandCoordinates}
            </p>
          </div>
        );
      case 2:
        return (
          <div style={{ padding: "2% 0" }}>
            <Typography variant="h4">Choose preferred crops</Typography>
            <Alert errorStatus={errorStatus} />
            <NewCheckboxes handleCropChange={handleCropChange} crops={crops} />
          </div>
        );
      case 3:
        return (
          <div style={{ padding: "2% 0" }}>
            <SelectedCropsCards selectedCrops={selectedCrops} />
          </div>
        );
      default:
        return "Unknown step";
    }
  }
  //LEAFLET Polygon draw
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
            <div style={{ padding: "2% 0" }}>
              <Typography varian="h6">Your order was completed.</Typography>
              <Typography varian="h6">
                You may track its process on "My orders" page.
              </Typography>
            </div>
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
                {activeStep === 0
                  ? "Start"
                  : activeStep === steps.length - 1
                  ? "Start"
                  : "Next"}
                {/* {activeStep === steps.length - 1 ?  "Start" : "Next"} */}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
//REDUX
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth.uid,
    profile: state.firebase.profile,
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
