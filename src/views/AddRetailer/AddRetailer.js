import React, { useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';
import { isObject } from 'validate.js';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddRetailer = props => {
  const [state, setState] = useState({
    name: '',
    phone: '',
    email: '',
    openSuccess: false,
    openError: false
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({ openSuccess: false, openError: false });
  };

  const classes = useStyles();
  const { className, ...rest } = props;

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = () => {
    const errors = checkForBlanks();
    if (errors) {
      alert('Fill all required fields');
    } else {
      //   var obj = {
      //     name: params.name,
      //     image: [params.image],
      //     brand: [selectedBrandData],
      //     category: [selectedCat.id, selectedSubcat.id]
      //   };
      //   UserModel.getInstance().addRetailer(
      //     obj,
      //     succ => {
      //       console.log(succ);
      //       props.history.push('/retailers');
      //     },
      //     err => {
      //       console.log(err);
      //     }
      //   );
    }
  };

  const checkForBlanks = () => {
    if (state.name === '' || state.phone === '' || state.email === '') {
      return true;
    }
  };

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Add Retailer" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify retailer name"
                  label="Retailer name"
                  margin="dense"
                  name="name"
                  onChange={handleChange}
                  required
                  value={state.name}
                  variant="outlined"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  margin="dense"
                  name="phone"
                  onChange={handleChange}
                  required
                  value={state.phone}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  margin="dense"
                  name="email"
                  onChange={handleChange}
                  required
                  value={state.email}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Snackbar
              open={state.openSuccess}
              autoHideDuration={6000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Sku successfully updated
              </Alert>
            </Snackbar>
            <Snackbar
              open={state.openError}
              autoHideDuration={6000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                Error when making changes. Ensure all fields are filled
              </Alert>
            </Snackbar>
          </CardContent>
          <Divider />
          <CardActions>
            <Button color="primary" variant="contained" onClick={handleSubmit}>
              Add Retailer
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default AddRetailer;
