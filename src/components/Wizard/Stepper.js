import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import LandChoser3 from './LandChoser3'
import { useHistory } from "react-router-dom"
//TEST
import Select from 'react-select';
import Dashboard from '../dashboard/Dashboard'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

function getSteps() {
  return ['Select Land Input', 'Choose culture type', 'Review your order'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <LandChoser3 />;
    case 1:
      return 'Checkbox items to choose from';
    case 2:
      return 'Review';
    default:
      return 'Unknown step';
  }
}

export default function VerticalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const history = useHistory();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  const handleDone = () => {
    window.alert('Thank you for your order. You can check your order status on "My orders" page')
    // setActiveStep(0);
    history.push("/");
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Next' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper 
          square elevation={0} 
          className={classes.resetContainer}
        >
          <Typography>Payment Options</Typography>
          <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.button}
          >
            Back
          </Button>
          <Button 
            onClick={handleDone} 
            className={classes.button}
            color="primary"
            variant="contained"
          >
            Finish
          </Button>
        </Paper>
      )}
    </div>
  );
}
//TEST
const options = [
  { value: 'dashboard', label: 'Map' },
  { value: 'LandNumberInput', label: 'Enter Land Number' },
  { value: 'CoordinatesInput', label: 'Enter Land Coordinates' },
  { value: 'UploadFile', label: 'Upload a file' }
];

class LandChoser3 extends React.Component {
  constructor(props){
    super(props)
 this.state = {
    selectedOption: null,
    landNumber:'',
    landCoordinates:'',
    fileURL: ''
  };
}
  handleChange = selectedOption => {
    this.setState(
        { selectedOption },
        () => console.log(`Option selected:`, this.state.selectedOption),
      );
      // alert('you selected' , this.state);
  };

  handleChildChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  render() {
    const {selectedOption} = this.state;

    return (
      <div className="overlay">
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
        />
       <div>
          {selectedOption && selectedOption.value === "LandNumberInput" ? (
             <LandNumberInput 
              handleChildChange = {this.handleChildChange.bind(this)}
              />
          ) : selectedOption && selectedOption.value === "CoordinatesInput" ? (
            <CoordinatesInput 
              handleChildChange = {this.handleChildChange.bind(this)}
              />
          ) : selectedOption && selectedOption.value === "UploadFile" ? (
            <UploadFile 
              handleChildChange = {this.handleChildChange.bind(this)}
              />
          ) : selectedOption && selectedOption.value === "dashboard" ? (
            <Dashboard />
          )  : null}
        </div>
      </div>
    );
  }
}


const LandNumberInput = (props) => {
  return (
      <div className="container">
        <input type="text" placeholder='Enter land number' id="landNumber" onChange={props.handleChildChange}/>
      </div>
  );
}

const CoordinatesInput = (props) => {
  return (
      <div className="container">
        <input type="text" placeholder='Enter the coordinates of your land' id="landCoordinates" onChange={props.handleChildChange}/>
      </div>
  );
}

const UploadFile = (props) => {
  return (
      <div className="container">
        <input type="text" placeholder='Enter the URL of your file' id="fileURL" onChange={props.handleChildChange}/>
      </div>
  );
}
