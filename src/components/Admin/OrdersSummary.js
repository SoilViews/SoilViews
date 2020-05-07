import React from "react";
import { connect } from "react-redux";
import { deleteProject } from "../../store/actions/projectActions";
import { withRouter } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

class UsersSummary extends React.Component {
  render() {
    const { order } = this.props;
    const StyledTableCell = withStyles((theme) => ({
      head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      body: {
        fontSize: 14,
      },
    }))(TableCell);

    const StyledTableRow = withStyles((theme) => ({
      root: {
        "&:nth-of-type(odd)": {
          backgroundColor: theme.palette.background.default,
        },
      },
    }))(TableRow);

    return (
      <React.Fragment>
        <div className="input-field col s12">
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Client name</StyledTableCell>
                  <StyledTableCell>Date ordered</StyledTableCell>
                  <StyledTableCell>List of cultures selected</StyledTableCell>
                  <StyledTableCell>Order Status</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow key={Math.random()}>
                  <StyledTableCell>{order.authorFirstName}</StyledTableCell>
                  <StyledTableCell>
                    {order.createdAt.toDate().toDateString()}
                  </StyledTableCell>
                  <StyledTableCell>{order.order}</StyledTableCell>
                  <StyledTableCell>{order.status.value}</StyledTableCell>
                  <StyledTableCell>
                    <Link
                      className="btn waves-effect waves-light"
                      to={"editOrder/" + order.id}
                      title="More Info"
                    >
                      Edit
                    </Link>
                    <br />
                    <hr />
                    <br />
                    <button
                      className="btn waves-effect waves-light"
                      type="submit"
                      name="action"
                      onClick={(e) => deleteProject(e, order.id)}
                    >
                      Delete
                      <i className="large material-icons">delete_forever</i>
                    </button>
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteProject: (e, id) => {
      e.preventDefault();
      dispatch(deleteProject(id));
    },
  };
};

export default connect(null, mapDispatchToProps)(withRouter(UsersSummary));
