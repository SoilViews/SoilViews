import React from 'react';
import Select from 'react-select';
import LandNumberInput from './LandNumberInput'
import UloadFile from './UploadFile'
import Dashboard from '../dashboard/Dashboard'
import CoordinatesInput from './CoordinatesInput'
 
const options = [
  { value: 'dashboard', label: 'Map' },
  { value: 'LandNumberInput', label: 'Enter Land Number' },
  { value: 'CoordinatesInput', label: 'Enter Land Coordinates' },
  { value: 'UploadFile', label: 'Upload a file' }
];

class LandChoser3 extends React.Component {
  state = {
    selectedOption: null,
    LandNumber:''
  };
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
             <LandNumberInput handleChildChange = {this.handleChildChange.bind(this)}/>
          ) : selectedOption && selectedOption.value === "CoordinatesInput" ? (
            <CoordinatesInput />
          ) : selectedOption && selectedOption.value === "UploadFile" ? (
            <UloadFile />
          ) : selectedOption && selectedOption.value === "dashboard" ? (
            <Dashboard />
          )  : null}
        </div>
      </div>
    );
  }
}

export default LandChoser3