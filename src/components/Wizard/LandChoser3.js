import React from 'react';
import Select from 'react-select';
import LandNumberInput from './LandNumberInput'
 
const options = [
  { value: 'dashboard', label: 'Map' },
  { value: 'LandNumberInput', label: 'Enter Land Number' },
  { value: 'CoordinatesInput', label: 'Enter Land Coordinates' },
  { value: 'UploadFile', label: 'Upload a file' },
];

class LandChoser3 extends React.Component {
  state = {
    selectedOption: null,
  };
  handleChange = selectedOption => {
    this.setState(
        { selectedOption },
        () => console.log(`Option selected:`, this.state.selectedOption)
      );
      // alert('you selected' , this.state);
  };
  render() {
    const {selectedOption} = this.state;

    return (
      <div>
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
        />
        <div>
          {/* Сработи ли това, 
          идеята ми е да се рендърва страницата 
          за съответото действие направо в стъпката и 
          после да се продължи напред */}
          {/* You selected: {this.state.selectedOption} */}
        <p>{this.state.selectedOption.value}</p>
        </div>
      </div>
    );
  }
}

export default LandChoser3

