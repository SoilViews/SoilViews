import React, {useState} from "react";
import { compose } from "redux";
// import CheckboxContainer from "../Checkboxes/CheckboxContainer";

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
      <button onClick={() => params.setName("i'm from Parent")}>
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

export class HelpPage extends React.Component {
  render() {
    return (
      <div class="section no-pad-bot" id="index-banner">
        <div class="container">
          {/* <h1 class="header center orange-text">Help Page</h1> */}
          <div class="row">
            {/* <h5 class="header col s12 light">Learn how to submit a project</h5>
            <h5 class="header col s12 light">How to work with mapping regions</h5> */}
            
            <GrandParent />
            {/* <CheckboxContainer/> */}
          </div>
        </div>
      </div>
    );
  }
}
export default compose()(HelpPage);

