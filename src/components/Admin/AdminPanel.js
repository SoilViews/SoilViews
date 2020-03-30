import React from "react";
import { compose } from "redux";
import { getFirestore } from 'redux-firestore';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


export class AdminPanel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      UserData: []
    }

  }




  componentWillMount() {
    const { UserData } = this.state;
    const firestore = getFirestore();
    firestore.collection("users").get().then(data => {

      data.forEach(doc => {

        // console.log( "User",doc.data());
        UserData.push(doc.data());


      });
      // UserData.map((user) => { return (console.log(user.city));});
      console.log("User:", UserData);
    });



  }



  render() {
    const { UserData } = this.state;
    const StyledTableCell = withStyles(theme => ({
      head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      body: {
        fontSize: 14,
      },
    }))(TableCell);


    const StyledTableRow = withStyles(theme => ({
      root: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.default,
        },
      },
    }))(TableRow);
    return (
      <div className="input-field col s12">
        <button onClick={this.onLoad}>Get specific user data</button>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>city</StyledTableCell>
                <StyledTableCell>email</StyledTableCell>
                <StyledTableCell>firstName</StyledTableCell>
                <StyledTableCell>initials</StyledTableCell>
                <StyledTableCell>lastName</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {UserData.map((user) => {
                return (
                  <StyledTableRow key={Math.random()}>
                    <StyledTableCell>{user.city}</StyledTableCell>
                    <StyledTableCell>{user.email}</StyledTableCell>
                    <StyledTableCell>{user.firstName}</StyledTableCell>
                    <StyledTableCell>{user.initials}</StyledTableCell>
                    <StyledTableCell>{user.lastName}</StyledTableCell>
                    <StyledTableCell>
                      <button class="waves-effect waves-light btn-small">Edit</button>
                      <button class="waves-effect waves-light btn-small">Delete</button>
                    </StyledTableCell>

                  </StyledTableRow>);
              }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    );
  }
}
export default compose()(AdminPanel)