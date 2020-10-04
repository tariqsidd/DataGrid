import React, { useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Switch from '@material-ui/core/Switch';

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

const EditRetailer = props => {
  var [retailerId, setRetailerId] = useState();
  //   const [state, setState] = useState({
  //     openSuccess: false,
  //     openError: false,
  //     switch: false
  //   });
  const [params, setParams] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    status: '',
    openSuccess: false,
    openError: false,
    switch: props.match.params.id
  });

  useEffect(() => {
    // const id = props.match.params.id;
    console.log('props id is.....: ', props.match.params);
    console.log('*******************edit retailer')
    // await UserModel.getInstance().getRetailerDetails(
    //   id,
    //   data => {
    //     console.log(data);
    //     setParams({
    //       ...params,
    //       name: data.name,
    //       phone: data.phone[0],
    //       email: data.email,
    //       discount: data.discount,
    //       switch: data.is_verify
    //     });
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
    // await setParams({ ...params, switch: props.location.state.switch });
    if (params.switch) {
      setParams({ ...params, status: 'Activated' });
    } else {
      setParams({ ...params, status: 'Deactivated' });
    }
    // UserModel.getInstance().getBrand(null, data => {
    //   var tmpArray = [];
    //   data.forEach(obj => {
    //     tmpArray.push({ id: obj.id, name: obj.name });
    //   });
    //   setBrandData(tmpArray);
    // });
  }, []);

  const classes = useStyles();
  const { className, ...rest } = props;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setParams({ ...params, openSuccess: false, openError: false });
  };

  const handleSwitch = async event => {
    console.log(event.target.checked);
    if (event.target.checked) {
      setParams({
        ...params,
        status: 'Activated'
      });
    } else {
      setParams({
        ...params,
        status: 'Deactivated'
      });
    }
    setParams({ ...params, switch: event.target.checked });
  };

  const handleChange = event => {
    setParams({
      ...params,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async () => {
    const errors = checkForBlanks();
    // if (errors) {
    //   setParams({ ...params, openError: true });
    // alert('Fill all required fields');
    // } else {
    //   var obj = {
    //     name: params.name,
    //     email: params.email,
    //     discount: 0.0,
    //     stock: 0,
    //     phone: [params.phone]
    //   };
    //   console.log(obj);
    //   await UserModel.getInstance().updateRetailer(
    //     retailerId,
    //     obj,
    //     succ => {
    //       console.log(succ);
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );
    await UserModel.getInstance().updateRetailer(
      props.location.state.id,
      { is_verify: params.switch },
      succ => {
        console.log(succ);
      },
      err => {
        console.log(err);
      }
    );

    await setParams({ ...params, openSuccess: true });
    //   setTimeout(() => {
    //     // props.history.push('/skus');
    //   }, 1500);
    // console.log(obj);
  };

  // const brandHandleChange = async event => {
  //   var arr = event.target.id.split('-')[2];
  //   if (arr) {
  //     setSelectedBrand(brandData[arr]);
  //   }
  // };

  const checkForBlanks = () => {
    // if (
    //   params.name === '' ||
    //   params.phone === '' ||
    //   selectedProd.length === 0 ||
    //   selectedSupplier.id === undefined ||
    //   params.email === ''
    // ) {
    //   return true;
    // } else {
    //   return false;
    // }
  };

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Change Retailer" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify Retailer name"
                  label="Retailer name"
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
                  label="Phone"
                  margin="dense"
                  name="phone"
                  onChange={handleChange}
                  required
                  value={params.phone}
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
                  value={params.email}
                  variant="outlined"
                />
              </Grid>
              <Snackbar
                open={params.openSuccess}
                autoHideDuration={6000}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                  Retailer successfully updated
                </Alert>
              </Snackbar>
              <Snackbar
                open={params.openError}
                autoHideDuration={6000}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                  Error when making changes. Ensure all fields are filled
                </Alert>
              </Snackbar>
            </Grid>
            <br />
            <Grid item md={6} xs={6}>
              <Switch
                checked={params.switch}
                onChange={handleSwitch}
                name="switch"
                color="primary"
              />
            </Grid>
            <Grid item md={6} xs={6}>
              <div>{params.status}</div>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button color="primary" variant="contained" onClick={handleSubmit}>
              Make changes
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default EditRetailer;
