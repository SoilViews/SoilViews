import React, { useState } from "react";
import { compose } from "redux";
import SimpleAlert from "../Wizard/Alert";

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
        </div>
      </div>
    );
  }
}
export default compose()(HelpPage);
