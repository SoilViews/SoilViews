import React from "react";

  const LandNumberInput = (props) => {
    return (
        <div className="container">
          <input type="text" placeholder='Enter land number' id="landNumber" onChange={props.handleChildChange}/>
        </div>
    );
  }

export default LandNumberInput