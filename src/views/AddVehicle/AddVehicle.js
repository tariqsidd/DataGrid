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

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddVehicle = props => {
   
  const classes = useStyles();
  const { className, ...rest } = props;
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });

  const [params, setParams] = useState({
    name:'',
    make:'',
    color:'',
    vehicleNumber:'',

  });

  useEffect(() => {
   
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
      var obj = {
        name:params.name,
        car_make:params.make,
        color:params.color,
        registration_number:params.vehicleNumber
      }
      console.log(obj);

  await UserModel.getInstance().addVehicle(
        obj,
        succ => {
          console.log(succ);
        },
        err => {
          console.log(err);
        }
      );
    
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
          <CardHeader title="Add Vehicle" />
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
                  contentEditable= {false}  
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
                Vehicle successfully added
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
              Add Vehicle
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default AddVehicle;
