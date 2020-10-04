import React, { useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
// import { Upload } from 'antd';
// import PhotoCamera from '@material-ui/icons/PhotoCamera';
// import 'antd/dist/antd.css';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardActionArea,
  CardMedia,
  Divider,
  Grid,
  Button,
  TextField,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  input: {
    display: 'none'
  },
  cardroot: {
    maxWidth: 250,
    marginTop: 30
  }
}));

const GreenCheckbox = withStyles({
  root: {
    color: 'orange',
    '&$checked': {
      color: 'orange'
    }
  },
  checked: {}
})(props => <Checkbox color="default" {...props} />);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ActivateRetailer = props => {
  const [activate, setActivate] = useState('');
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });

  const [params, setParams] = useState({
    retailerId: '',
    name: '',
    mobile: '',
    password: '',
  });

  useEffect(() => {
    console.log('************** props params', props.match.params.id);
    UserModel.getInstance().getRetailerDetails(
      props.match.params.id,
      succ => {
        console.log('is_verify statuss', succ);
        setActivate(succ.is_verify);
        setParams({
          ...params,
          name: succ.name,
          retailerId: succ.id,
          mobile: succ.mobile
        })
      },
      err => {
        console.log(err);
      }
    );
  }, []);

  const classes = useStyles();
  const { className, ...rest } = props;

  const handleChange = event => {
    setParams({
      ...params,
      [event.target.name]: event.target.value
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenData({ openSuccess: false, openError: false });
  };

  const handleSubmit = async () => {
    await UserModel.getInstance().updateRetailer(
      props.match.params.id,
      { is_verify: activate },
      succ => {
        console.log(succ);
        if (params.password !== '') {
          UserModel.getInstance().retailerChangePassword(
            {
              mobile: params.mobile,
              password: params.password
            },
            async succ => {
              await setOpenData({ openSuccess: true });
              console.log('succ change password', succ);
              setTimeout(() => {
                props.history.push('/retailers');
              }, 3000);
            },

            err => {
              alert('cannot change Password!');
              console.log('err change password', err);
            }
          );
        } else {
          setOpenData({ openSuccess: true });
          setTimeout(() => {
            props.history.push('/retailers');
          }, 3000);
        }
        setOpenData({ openError: false, openSuccess: true });
      },
      err => {
        alert('cannot update retailer activation!');
        console.log(err);
        setOpenData({ openError: true, openSuccess: false });
      }
    );
  };

  const handleStock = event => {
    console.log('check', event.target.checked);
    setActivate(event.target.checked);
  };

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Retailer Activation" />
          <Divider />
          <Grid item md={6} xs={12}>
            <FormControlLabel
              control={
                <GreenCheckbox
                  checked={activate}
                  onChange={handleStock}
                  name="activate"
                />
              }
              label="Activate Retailer"
              color="red"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              disabled
              helperText="Specify Retailer Name"
              label="Retailer Name"
              margin="dense"
              name="name"
              //  onChange={handleChange}
              required
              value={params.name}
              variant="outlined"
              placeholder="Enter Retailer Name"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              disabled
              helperText="Specify Mobile Number"
              label="Mobile Number"
              margin="dense"
              name="mobile"
              //  onChange={handleChange}
              required
              value={params.mobile}
              variant="outlined"
              placeholder="Enter Mobile Number"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              helperText="Reset Retailer Password"
              label="Change Password"
              margin="dense"
              name="password"
              onChange={handleChange}
              required
              value={params.password}
              variant="outlined"
              placeholder="Enter Password"
            />
          </Grid>
          <CardContent>
            <Snackbar
              open={openData.openSuccess}
              autoHideDuration={3000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Retailer successfully updated
              </Alert>
            </Snackbar>
            <Snackbar
              open={openData.openError}
              autoHideDuration={6000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                Error when making changes
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

export default ActivateRetailer;
