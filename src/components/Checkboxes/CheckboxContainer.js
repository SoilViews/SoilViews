import React from "react";
import Checkbox from "./Checkbox";
import checkboxes from "./Checkboxes";
import SelectedFood from "../Checkboxes/SelectedFood";

class CheckboxContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedItems: new Map(),
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState((prevState) => ({
      checkedItems: prevState.checkedItems.set(item, isChecked),
    }));
  }

  render() {
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
        <SelectedFood {...this.state}/>
      </React.Fragment>
    );
  }
}

export default CheckboxContainer;
