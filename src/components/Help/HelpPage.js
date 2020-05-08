import React, {useState} from "react";
import { compose } from "redux";
// import CheckboxContainer from "../Checkboxes/CheckboxContainer";
import SimpleAlert from "../Wizard/Alert"
// import SimpleTable from "./TableTest"
import MaterialTableDemo from "./MaterialTable"

export const GrandParent = () => {
  const [name, setName] = useState("i'm Grand Parent");
  return (
    <>
      <div>{name}</div>
      <Parent setName={setName} />
    </>
  );
};

const Parent = params => {
  return (
    <>
      <button onClick={() => SimpleAlert()}>
        from Parent
      </button>
      <Child setName={params.setName} />
    </>
  );
};

const Child = params => {
  return (
    <>
      <button onClick={() => params.setName("i'm from Child")}>
        from Child
      </button>
    </>
  );
};

class HelpPage extends React.Component {
  render() {
    return (
      <div class="section no-pad-bot" id="index-banner">
        <div class="container">
          {/* <h1 class="header center orange-text">Help Page</h1> */}
          <div class="row">
            <MaterialTableDemo />
          </div>
        </div>
      </div>
    );
  }
}
export default compose()(HelpPage);
