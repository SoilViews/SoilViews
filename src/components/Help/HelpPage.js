import React, { useState } from "react";
import { compose } from "redux";
import SimpleAlert from "../Wizard/Alert";
// import TestDrop from "./TestDrop";
import TestEkate from "./TestEkate";


export const GrandParent = () => {
  const [name, setName] = useState("i'm Grand Parent");
  return (
    <>
      <div>{name}</div>
      <Parent setName={setName} />
    </>
  );
};

const Parent = (params) => {
  return (
    <>
      <button onClick={() => SimpleAlert()}>from Parent</button>
      <Child setName={params.setName} />
    </>
  );
};

const Child = (params) => {
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
      <div className="container">
        <div className="row">
          <p>Documentation page</p>
          <p>Instructions for use</p>
          <p>Documentation on everyuser action</p>
          {/* <TestDrop /> */}
          <TestEkate />
        </div>
      </div >
    );
  }
}
export default compose()(HelpPage);
