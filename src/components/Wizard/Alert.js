import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SimpleAlerts({errorStatus}) {
  const classes = useStyles();

  return (
    errorStatus !== null && (
    <div className={classes.root}>
      <Alert variant="outlined" severity="warning">
        You must select at least one Crop type
      </Alert>
    </div>
    )
  );
}
