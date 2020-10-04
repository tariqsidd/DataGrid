import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { validateNumeric } from '../../common/validators';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  MenuItem
} from '@material-ui/core';
import validate from 'validate.js';

const cities = [
  {
    value: 1,
    label: 'Karachi'
  },
  {
    value: 2,
    label: 'Lahore'
  }
];

const schema = {
  mobile: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 10,
      minimum: 10
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 10,
      minimum: 6
    }
  },
  cnic: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 13,
      minimum: 13
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddDriver = props => {
  const classes = useStyles();
  const { className, ...rest } = props;
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });
  // var [searchedProd, setSearchedProd] = useState('');

  const [params, setParams] = useState({
    name: '',
    mobile: '',
    address: '',
    cnic: '',
    cityId: '1',
    password: '',
    vehicleId: ''
  });
  const [vehicles, setVehicles] = useState([]);

  const [formState, setFormState] = useState({
    isValid: false,
    touched: {},
    errors: {}
  });

  useEffect(() => {
    if (vehicles.length < 1) {
      UserModel.getInstance().getVehicles(
        null,
        async data => {
          console.log('vehicle resposnes', data);
          let tempArr = [];

          data &&
            data.length > 0 &&
            Array.isArray(data) &&
            (await data.forEach((obj, index) => {
              tempArr.push({
                value: obj.id,
                label:
                  obj.name +
                  ' - ' +
                  obj.car_make +
                  ' - ' +
                  obj.color +
                  ' - ' +
                  obj.registration_number
              });
            }));
          setVehicles(tempArr);
        },
        err => {
          setVehicles({ value: '', label: 'no vehicles' });
          console.log(err);
        }
      );
    }

    const errors = validate(params, schema);
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [params]);

  const handleChange = event => {
    setParams({
      ...params,
      [event.target.name]: event.target.value
    });
    setFormState({
      ...formState,
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    });
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const checkErrors = () => {
    if (
      params.name === '' ||
      params.address === '' ||
      params.mobile === '' ||
      params.cnic === '' ||
      params.password === '' ||
      params.vehicleId === ''
    ) {
      return true;
    } else {
      return false;
    }
  };

  const checkForValidate = () => {
    const checkMobile = validateNumeric(params.mobile);
    console.log('checkMobile', checkMobile);
    const checkCnic = validateNumeric(params.cnic);
    console.log('check Cnic', checkCnic);
    console.log('mobile number', params.mobile[0]);
    if (params.mobile[0] == 0) {
      alert('Plz Enter a mobile Number without 0. E.g : 3352493858');
      return false;
    }
    if (!checkMobile || !checkCnic) {
      console.log('if chala');
      if (!checkMobile) {
        alert('plz enter a valid mobile Number');
      }
      if (!checkCnic) {
        alert('plz enter a valid Cnic Number');
      }
      return false;
    } else {
      return true;
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
    const valid = formState.isValid;
    if (valid) {
      const validate = checkForValidate();
    } else {
      alert('correctly fill all fields');
    }

    console.log('formState.isValid', formState.isValid);
    console.log('check', check);
    if (valid && validate) {
      if (!check) {
        var obj = {
          name: params.name,
          mobile: '+92' + params.mobile,
          password: params.password,
          address: params.address,
          detail: {
            cnic: params.cnic,
            city_id: params.cityId,
            vehicle_id: params.vehicleId
          }
        };
        console.log('add obj', obj);
        await UserModel.getInstance().addDriver(
          obj,
          async succ => {
            console.log(succ);
            await setOpenData({ openSuccess: true });
            setTimeout(() => {
              props.history.push('/drivers');
            }, 1500);
          },
          err => {
            console.log(err);
            alert(err);
          }
        );
      } else {
        setOpenData({ openError: true });
        // alert('Fill all fields');
      }
    }
  };

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Add Driver" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify Driver Name"
                  label="Enter Driver Name"
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
                  type="numeric"
                  error={hasError('mobile')}
                  helperText={
                    hasError('mobile')
                      ? formState.errors.mobile[0]
                      : 'Enter Mobile Number'
                  }
                  label="Mobile"
                  placeholder="eg : 3352493858"
                  margin="dense"
                  name="mobile"
                  onChange={handleChange}
                  required
                  value={params.mobile}
                  variant="outlined"
                  contentEditable={false}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Enter Address"
                  label="Address"
                  margin="dense"
                  name="address"
                  onChange={handleChange}
                  required
                  value={params.address}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  error={hasError('cnic')}
                  helperText={
                    hasError('cnic') ? formState.errors.cnic[0] : 'Enter CNIC'
                  }
                  label="CNIC"
                  margin="dense"
                  name="cnic"
                  onChange={handleChange}
                  required
                  value={params.cnic}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  select
                  label="City"
                  name="cityId"
                  value={params.cityId || 1}
                  onChange={handleChange}
                  helperText="Please select City"
                  variant="outlined">
                  {cities.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Vehicle"
                  name="vehicleId"
                  value={params.vehicleId}
                  onChange={handleChange}
                  helperText="Please select Vehicle"
                  variant="outlined">
                  {vehicles.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  error={hasError('password')}
                  helperText={
                    hasError('password')
                      ? formState.errors.password[0]
                      : 'Create Password'
                  }
                  label="Password"
                  margin="dense"
                  name="password"
                  type="password"
                  placeholder="atleast 6 characters"
                  onChange={handleChange}
                  required
                  value={params.password}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Snackbar
              open={openData.openSuccess}
              autoHideDuration={3000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Driver successfully added
              </Alert>
            </Snackbar>
            <Snackbar
              open={openData.openError}
              autoHideDuration={3000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                Error when making changes. Ensure all fields are correctly
                filled
              </Alert>
            </Snackbar>
          </CardContent>
          <Divider />
          <CardActions>
            <Button color="primary" variant="contained" onClick={handleSubmit}>
              Add Driver
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default AddDriver;
