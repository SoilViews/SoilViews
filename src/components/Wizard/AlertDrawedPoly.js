import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SimpleAlerts({ errorStatusPolly }) {
  const classes = useStyles();

  return (
    errorStatusPolly !== null && (
      <div className={classes.root}>
        <Alert variant="outlined" severity="warning">
          You must draw at least one polygon
        </Alert>
      </div>
    )
  );
}
