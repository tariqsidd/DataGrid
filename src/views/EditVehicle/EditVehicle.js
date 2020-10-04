import React, { useEffect, useState } from 'react';
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
import data from 'views/Dashboard/components/LatestOrders/data';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditVehicle = props => {
  console.log(props);
  const classes = useStyles();
  const { className, ...rest } = props;
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });

  const [params, setParams] = useState({
    name: '',
    make: '',
    color: '',
    vehicleNumber: ''
  });

  useEffect(() => {
    console.log('props', props.match.params.id);
    UserModel.getInstance().getEditVehicle(
      props.match.params.id,
      data => {
        console.log(data);
        setParams({
          ...params,
          name: data.name,
          make: data.car_make,
          color: data.color,
          vehicleNumber: data.registration_number
        });
      },
      err => {
        console.log('err', err);
      }
    );
  }, []);

  const handleChange = event => {
    setParams({
      ...params,
      [event.target.name]: event.target.value
    });
  };

  const checkErrors = () => {
    if (
      params.name === '' ||
      params.color === '' ||
      params.make === '' ||
      params.vehicleNumber === ''
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenData({ openSuccess: false, openError: false });
  };

  const handleSubmit = async () => {
    const check = checkErrors();
    if (!check) {
      await setOpenData({ openSuccess: true });
      setTimeout(() => {
        props.history.push('/vehicles');
      }, 1500);
    } else {
      setOpenData({ openError: true });
    }
  };

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Change Vehicle Info" />
          <div> Vehicle Id : {props.match.params.id}</div>
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify your name"
                  label="Enter Name"
                  margin="dense"
                  name="name"
                  onChange={handleChange}
                  required
                  value={params.name}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify Car Make"
                  label="Car Make"
                  margin="dense"
                  name="make"
                  onChange={handleChange}
                  required
                  value={params.make}
                  variant="outlined"
                  contentEditable={false}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify Car Color"
                  label="Color"
                  margin="dense"
                  name="color"
                  onChange={handleChange}
                  required
                  value={params.color}
                  variant="outlined"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify Registration Number"
                  label="Registration Number"
                  margin="dense"
                  name="vehicleNumber"
                  onChange={handleChange}
                  required
                  value={params.vehicleNumber}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Snackbar
              open={openData.openSuccess}
              autoHideDuration={6000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Vehicle successfully updated
              </Alert>
            </Snackbar>
            <Snackbar
              open={openData.openError}
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
              Make Changes
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default EditVehicle;
