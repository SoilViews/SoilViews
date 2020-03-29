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
        () => console.log(`Option selected:`, this.state.selectedOption),
      );
      // alert('you selected' , this.state);
  };
  render() {
    const {selectedOption} = this.state;
    const getOptionValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label

    return (
      <div>
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
        />
        <p>{ selectedOption }</p>
      </div>
    );
  }
}

export default LandChoser3

