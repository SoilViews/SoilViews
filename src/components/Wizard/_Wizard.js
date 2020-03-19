import React from "react";

class Wizard extends React.Component {
   
   _next(data) {

        this.setState = {
            //DB collection
        }
     
     // look familiar?
     let currentStep = this.state.currentStep;
     if (currentStep >= 2) {
       currentStep = 3;
     } else {
       currentStep = currentStep + 1;
     }
     
     this.setState({
       currentStep: currentStep
     });
   }
   render() {
    let currentStep = this.state.currentStep;
     return(
       <div>
          <step1Options currentStep={currentStep} afterValid={this._next}/>
       </div>
     );
   }
  }

  export default Wizard