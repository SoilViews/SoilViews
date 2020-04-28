import React from "react";
import Checkbox from "./Checkbox";
import SelectedFood from "../Checkboxes/SelectedFood";

var checkboxes = [
  {
    name: "check-1",
    key: "check1key",
    label: "check 1",
    selected: false,
  },
  {
    name: "check-2",
    key: "check2key",
    label: "check 2",
    selected: false,
  },
  {
    name: "check-3",
    key: "check3key",
    label: "check 3",
    selected: true,
  },
  {
    name: "check-4",
    key: "check4key",
    label: "check 4",
    selected: true,
  },
];

class CheckboxContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedItems: new Map(),
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    const results = this.state;
    console.log(results);
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState((prevState) => ({
      checkedItems: prevState.checkedItems.set(item, isChecked),
    }));
  }

  render() {
    const selectedBoxes = checkboxes.filter((item) => {
      return item.selected;
    });
    const renderSelectedBoxes = selectedBoxes.map((item) => {
      return <label key={item.key}>{item.name}</label>;
    });
    return (
      <React.Fragment>
        {checkboxes.map((item) => (
          <p>
            <label key={item.key}>
              <Checkbox
                name={item.name}
                checked={this.state.checkedItems.get(item.name)}
                onChange={this.handleChange}
              />
              <span>{item.name}</span>
            </label>
          </p>
        ))}
        {renderSelectedBoxes}
      </React.Fragment>
    );
  }
}

export default CheckboxContainer;
