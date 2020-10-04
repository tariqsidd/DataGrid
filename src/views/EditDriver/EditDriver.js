import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {validateNumeric} from '../../common/validators'
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
import validate from 'validate.js'

const cities = [
  {
    value: 1,
    label: 'Karachi',
  },
  {
    value: 2,
    label: 'Lahore',
  },

];


const schema = {
  mobile: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 10,
      minimum:10
      
    }
  },
  cnic :{
    presence: { allowEmpty: false, message: 'is required' },
    length:{
      maximum:13,
      minimum:13
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

const EditDriver = props => {
  console.log(props);
  const classes = useStyles();
  const { className, ...rest } = props;
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });

  const [params, setParams] = useState({
    name:'',
    mobile:'',
    address:'',
    cnic:'',
    vehicleId:'',
    cityId:'',
  });

  const [counter,setCounter] = useState(0);
  
  const [vehicles,setVehicles] = useState([]) 
  
  const [formState, setFormState] = useState({
    isValid: false,
    touched: {},
    errors: {}
  });

  useEffect(() => {
    if(counter==0)
    {
      setCounter(1)
      UserModel.getInstance().getSingleDriver(
        props.match.params.id,
        data => {
          console.log(data);
          setParams({
            ...params,
            name:data.name,
            mobile:data.mobile.split('+92')[1],
            address:data.address,
            cnic:data.cnic,
            vehicleId:data.vehicle_id,
            cityId:data.city_id,

          })
         console.log('data',data)
          
        },
        err => {
          console.log(err);
        }
      );
    
   
      UserModel.getInstance().getVehicles(null,
        async data => {
          console.log('vehicle respones',data)
          let tempArr = [];
  
          data && data.length>0 && Array.isArray(data) && await data.forEach((obj,index) => {
          tempArr.push({
            value:obj.id,
            label: obj.name + ' - ' +  obj.car_make + ' - ' + obj.color + ' - ' + obj.registration_number
          });
        });
        setVehicles(tempArr)
      
        },
        err => {
          setVehicles({value:'',label:'no vehicles'})
          console.log(err)
  
        }
        )
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

  const checkForValidate = () => {
   
    const checkMobile = validateNumeric(params.mobile)
    console.log('checkMobile',checkMobile)
    const checkCnic = validateNumeric(params.cnic);
    console.log('check Cnic',checkCnic);
    console.log('mobile number',params.mobile[0])
    if(params.mobile[0]==0)
     {
       alert('Plz Enter a mobile Number without 0. E.g : 3352493858')
       return false;
     }
      if(!checkMobile || !checkCnic){
        console.log('if chala')
        if(!checkMobile)
        {
          alert('plz enter a valid mobile Number');
        }
        if(!checkCnic)
        {
          alert('plz enter a valid Cnic Number');
        }
        return false;
      }
      else{
        return true;
      }   

  }

  const hasError = field => formState.touched[field] && formState.errors[field] ? true : false;

  const checkErrors = () => {
      console.log('params',params)
    if (
      
      params.name === '' ||
      params.address === '' ||
      params.mobile === '' ||
      params.cnic === ''   ||
      params.vehicleId==='' ||
      params.cityId === ''
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
    
    const valid = formState.isValid;
    if(valid){
      const validate = checkForValidate();
    }
    else{
      alert('correctly formstate fill all fields')
    }
  
  console.log('formState.isValid',formState.isValid);
  console.log('check',check) 

   if(valid && validate){
    if (!check) {
      var obj = {
        name:params.name,
        mobile: '+92' + params.mobile,
        address:params.address,
        detail:{
        cnic:params.cnic,
        city_id:params.cityId,
        vehicle_id:params.vehicleId
        }
      };
      console.log('edit obj',obj);
      await UserModel.getInstance().updateDriver(
        props.match.params.id,
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
          alert(err)
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
          <CardHeader title="Change Driver Info" />
  <div>Driver Id : {props.match.params.id}</div>          
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
                  error={hasError('mobile')}
                  helperText={
                    hasError('mobile') ? formState.errors.mobile[0] : "Enter Mobile Number"
                  }
                  label="Mobile Number"
                  margin="dense"
                  name="mobile"
                  onChange={handleChange}
                  required
                  value={params.mobile}
                  variant="outlined"
                  contentEditable= {false}  
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
                    hasError('cnic') ? formState.errors.cnic[0] : "Enter CNIC"
                  }
                  label="CNIC"
                  margin="dense"
                  name="cnic"
                  data-inputmask={3333-2222} 
                  placeholder="XXXXX-XXXXXXX-X" 
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
                   value={params.cityId}
                   onChange={handleChange}
                   helperText="Please select City"
                   variant="outlined"
                   
                      >
          {cities.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        </Grid>
              <Grid item md={6} xs={12}>
              <TextField
                   fullWidth
                   select
                   label="Vehicle"
                   name="vehicleId"
                   value={params.vehicleId}
                   onChange={handleChange}
                   helperText="Please select Vehicle"
                   variant="outlined"
                   
                      >
          {vehicles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        </Grid>

              {/* <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Create Password"
                  label="Password"
                  margin="dense"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                  value={params.password}
                  variant="outlined"
                />
              </Grid> */}
            </Grid>
            <Snackbar
              open={openData.openSuccess}
              autoHideDuration={6000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Driver successfully updated
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

export default EditDriver;
