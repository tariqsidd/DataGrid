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

const AddUser = props => {
  const [state, setState] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    openSuccess: false,
    openError: false
  });

  const roleOptions = [
    // { id: 1, name: 'Admin' },
    // { id: 2, name: 'Supplier' },
    // { id: 3, name: 'Retailer' },
    // { id: 4, name: 'Driver' },
    { id: 5, name: 'Sales' },
  ];
  const [selectedRole, setSelectedRole] = useState({})

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

  const handleSubmit = (e) => {
    const errors = checkForBlanks();
    console.log(e)
    if (errors) {
      alert('Fill all required fields');
    } else {
      var obj = {
        name: state.name,
        mobile: state.mobile,
        email: state.email,
        password: state.password,
        role_id: selectedRole.id
      };
      UserModel.getInstance().addUser(
        obj,
        succ => {
          console.log(succ);
          props.history.push('/users');
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  const handleRoleChange = (e, value) => {
    // console.log({value}, e.target.value, e.target.name);
    setSelectedRole({ id: value.id, name: value.name });
  };

  const checkForBlanks = () => {
    console.log({state}, {selectedRole})
    if (state.name === '' ||
      state.mobile === '' ||
      // state.email === '' ||
      state.password === '' ||
      !selectedRole.id ||
      selectedRole.name === '') {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Add User" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="role"
                  options={roleOptions}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      margin="dense"
                      label="Role"
                      variant="outlined"
                      required
                    />
                  )}
                  onChange={handleRoleChange}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify user name"
                  label="User name"
                  margin="dense"
                  name="name"
                  onChange={handleChange}
                  required
                  value={state.name}
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
                    value={state.email}
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
                  value={state.password}
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
                  value={state.mobile}
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
            <Button color="primary" variant="contained" onClick={e => handleSubmit(e)}>
              Add User
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default AddUser;
