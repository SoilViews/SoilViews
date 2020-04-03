import React from "react";
import { saveOrderData} from '../../store/actions/newOrder';
import { connect } from 'react-redux';
import VerticalLinearStepper from './Stepper'

export class Wizard extends React.Component {
  constructor(props){
    super(props)

      this.state = {
      
        fileURL: '',                  //populates When file is uploaded
        status: 'submitted',          //initial status
        landNumber: '',               //populates when landNumber is typed
        coordinatesInput: {           //populates when coordinated are entered manually
          lat:[],
          lon:[]
        },
        cropTypesChosen: [],          //populates when crops are chosen
        notes: '',
        cost:'',
        

      }
  }

  onSubmitForm = (e) => {
    e.preventDefault();

    // const { landInput,fileURL,status} = this.state;
    this.props.saveOrderData(this.state);
    this.props.history.push('/')
    window.alert("Thank you for your order. You can track its progress on 'My Orders' page");
  }
    onChangeInput = (e) => {
      this.setState({
          [e.target.id]: e.target.value
      })
  }

  render(){
    return (

                <div class="section no-pad-bot" id="index-banner">
                  <div class="container">
                  
                    <h1 class="header center orange-text">New Order</h1>
          <br></br>
          <VerticalLinearStepper/>
                   
                  </div>
                </div>
    );
  }
}



const mapStateToProps = (state, ownProps) => {
  return {
      auth: state.firebase.auth,
      profile: state.firebase.profile
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    saveOrderData: (orders) => dispatch(saveOrderData(orders))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wizard)
