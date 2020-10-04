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

const EditUser = props => {
  var [userId, setUserId] = useState();
  //   const [state, setState] = useState({
  //     openSuccess: false,
  //     openError: false,
  //     switch: false
  //   });
  const [params, setParams] = useState({
    id: '',
    name: '',
    mobile: '',
    email: '',
    password: '',
    status: '',
    openSuccess: false,
    openError: false,
    switch: false
  });

  const roleOptions = [
    // { id: 1, name: 'Admin' },
    // { id: 2, name: 'Supplier' },
    // { id: 3, name: 'Retailer' },
    // { id: 4, name: 'Driver' },
    { id: 5, name: 'Sales' },
  ];
  const [selectedRole, setSelectedRole] = useState({})

  useEffect(async () => {
    const id = props.match.params.id;
    setUserId(id)
    console.log('props id is.....: ', props.match.params);
    console.log({props});
    await UserModel.getInstance().getUserDetails(
      id,
      data => {
        console.log(data);
        setParams({
          ...params,
          name: data.name,
          mobile: data.mobile,
          email: data.email,
          password: data.password,
          switch: data.is_verify
        });
        setSelectedRole({id: data.role_id, name: data.role_name})
      },
      err => {
        console.log(err);
      }
    );
    // await setParams({ ...params, switch: props.location.state.switch });
    if (params.switch) {
      setParams({ ...params, status: 'Activated' });
    } else {
      setParams({ ...params, status: 'Deactivated' });
    }
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

  const handleSubmit = async (e) => {
    const errors = checkForBlanks();

    if (errors) {
      setParams({ ...params, openError: true });
      alert('Fill all required fields');
    } else {
      var obj = {
        name: params.name,
        mobile: params.mobile,
        email: params.email,
        password: params.password,
        role_id: selectedRole.id
      };
      console.log(obj);
      await UserModel.getInstance().updateUser(
        userId,
        obj,
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
      }
  };
 
  const handleRoleChange = (e, value) => {
    // console.log({value}, e.target.value, e.target.name);
    setSelectedRole({ id: value.id, name: value.name });
  };

  const checkForBlanks = () => {
    if (
      params.name === '' ||
      params.mobile === '' ||
      // params.email === '' ||
      params.password === '' ||
      !selectedRole.id || 
      selectedRole.name === ''
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Change User" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="role"
                  options={roleOptions}
                  getOptionLabel={option => option.name}
                  value={selectedRole}
                  disabled
                  renderInput={params => (
                    <TextField
                      {...params}
                      margin="dense"
                      label="Role"
                      variant="outlined"
                      disabled
                    />
                  )}
                  onChange={handleRoleChange}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify User name"
                  label="User name"
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
                  label="Mobile"
                  margin="dense"
                  name="mobile"
                  onChange={handleChange}
                  required
                  value={params.mobile}
                  variant="outlined"
                />
              </Grid>
              
              {selectedRole.id === 3 &&
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
              }
              
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  margin="dense"
                  name="password"
                  type='password'
                  onChange={handleChange}
                  required
                  value={params.password}
                  variant="outlined"
                />
              </Grid>

              <Snackbar
                open={params.openSuccess}
                autoHideDuration={6000}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                  User successfully updated
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
            <Button color="primary" variant="contained" onClick={(e) => handleSubmit(e)}>
              Make changes
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default EditUser;
