import React from "react";
import { saveOrderData} from '../../../store/actions/authActions';
import { connect } from 'react-redux';


export class WizardOrder extends React.Component {
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

        //         <div class="section no-pad-bot" id="index-banner">
          //         <div class="container">
                  
          //           <h1 class="header center orange-text">Please select an option</h1>
          //           <div class="row center">
          //             <Link to='/Dashboard'><h5 className="center btn waves-effect waves-light">Mark your land on the map</h5></Link>
          //             <Link to='/CoordinatesInput'><h5 className="center btn waves-effect waves-light">Enter your land coordinates</h5></Link>
          //             <Link to='/UploadFile'><h5 className="center btn waves-effect waves-light">Upload a File</h5></Link>
          //             <Link to='/LandNumberInput'><h5 className="center btn waves-effect waves-light">Enter your land number</h5></Link>
          // <br></br>
          //             <Link to='/'><h5 className="center btn waves-effect waves-light">back</h5></Link>
          //          </div>
          //         </div>
        //         </div>
        <div></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(WizardOrder)
