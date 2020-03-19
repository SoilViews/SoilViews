import React from "react"
import { render } from "react-dom"

class step1Options extends React.Component{
    constructor(props){
        super(props); {
            //DB + form Bindings
        }
    }

    _validate() {
        this.props.afterValid(this.state)
      }


            render(){

                if (this.props.currentStep !== 1) {
                    return null;

                return(
                    <div>
                        <form>
                            <button onClick={this._validate}/>
                        </form>
                    </div>
                );
            } 
        }
}

export default step1Options