import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import CheckBoxIcon from '@material-ui/icons/CheckBox';

export function FoodCheckbox() {
  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    // console.log("You Selected: ", { ...state });
  };
  SelectedFood({ state });
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={state.checkedA}
            onChange={handleChange}
            name="checkedA"
          />
        }
        label="Secondary"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.checkedB}
            onChange={handleChange}
            name="checkedB"
            color="primary"
          />
        }
        label="Primary"
      />
    </FormGroup>
  );
}

export function SelectedFood(checked) {
  console.log(checked);
  const result = JSON.stringify(checked);
  return <div>You selected: {result}</div>;
}

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

function getSteps() {
  return [
    "View block and satelite image",
    "Choose rate and draw",
    "Choose your preferred crops",
    "Download prescription file",
  ];
}

export default function HorizontalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    // console.log("You Selected: ", { ...state });
  };
  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: false,
  });
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const mapEvent = (e) => {
    var ee = document.createEvent("Event");
    ee.initEvent("click", true, true);
    var cb = document.getElementsByClassName("leaflet-draw-draw-polygon");
    return !cb[0].dispatchEvent(ee);
  };
  if (activeStep === 0)
    return (
      <div>
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
        <Button variant="contained" color="primary" onClick={handleNext}>
          {activeStep === activeStep.length - 1
            ? "Finish"
            : activeStep === 0
            ? "Start"
            : "Next"}
        </Button>
      </div>
    );
  if (activeStep === 1)
    return (
      <div>
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
        <Button variant="contained" color="primary" onClick={handleNext}>
          {activeStep === activeStep.length - 1
            ? "Finish"
            : activeStep === 0
            ? "Start"
            : "Next"}
        </Button>
        &nbsp; &nbsp;
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            mapEvent(e);
          }}
        >
          Draw a polygon
        </Button>
        &nbsp; &nbsp;
        <Button
          style={{
            ...(activeStep === 0 ? { display: "none" } : {}),
          }}
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
      </div>
    );
  if (activeStep === 2)
    return (
      <div>
        <div>
          <h3>Choose your crops type of drawed land</h3>
          <p>Crops type:</p>
          <FoodCheckbox handleChange={handleChange} />
        </div>
        <Button variant="contained" color="primary" onClick={handleNext}>
          {activeStep === activeStep.length - 1
            ? "Finish"
            : activeStep === 0
            ? "Start"
            : "Next"}
        </Button>
        <Button
          style={{
            ...(activeStep === 0 ? { display: "none" } : {}),
          }}
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
      </div>
    );
  if (activeStep === 3)
    return (
      <div>
        <div>
          <h3>Selected crops type</h3>
          <p>Crops type</p>
          <FoodCheckbox handleChange={handleChange} />
        </div>
        <Button variant="contained" color="primary" onClick={handleNext}>
          {activeStep === activeStep.length - 1
            ? "Finish"
            : activeStep === 0
            ? "Start"
            : "Next"}
        </Button>
        <Button
          style={{
            ...(activeStep === 0 ? { display: "none" } : {}),
          }}
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
      </div>
    );
  if (activeStep === 4)
    return (
      <div>
        <div>
          <h3>Finish</h3>
          <p>finish</p>
        </div>
        <Button variant="contained" color="primary" onClick={handleNext}>
          {activeStep === 4 ? "Finish" : activeStep === 0 ? "Start" : "Next"}
        </Button>
        <Button onClick={handleReset} className={classes.button}>
          Reset
        </Button>
      </div>
    );
  if (activeStep === 5)
    return (
      <div>
        <Typography className={classes.instructions}>
          All steps completed - you&apos;re finished
        </Typography>
        <Button className={classes.button}>Thank you!</Button>
      </div>
    );
  // TO VIEW THE STEPPER
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
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
      <div></div>
    </div>
  );
}
