import React, { useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
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
import { isObject } from 'validate.js';
import { validateNumeric } from '../../common/validators';
import { withStyles } from '@material-ui/core/styles';

const GreenCheckbox = withStyles({
  root: {
    color: 'orange',
    '&$checked': {
      color: 'orange'
    }
  },
  checked: {}
})(props => <Checkbox color="default" {...props} />);

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditBroadcastMessage = props => {
  // console.log(props.location.state);
  const classes = useStyles();
  const { className, ...rest } = props;
  var [broadcastMessageId, setBroadcastMessageId] = useState('');

  var [cityData, setCityData] = useState([]);
  var [selectedCity, setSelectedCity] = useState({});

  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });
  // var [searchedProd, setSearchedProd] = useState('');
  // const [fileList, setFileList] = useState([]);

  const [params, setParams] = useState({
    name: '',
    dataFetchStatus: true,
    submitStatus: false
  });

  // useEffect(() => {
  //   console.log({ params, selectedType, dealData, dealSearchText, selectedDeal, prodSkusData, prodSkuSearchText, selectedProdSku })
  // })

  useEffect(() => {
    console.log({ props });
    console.log('************** props params', props.match.params.BroadcastMessageId);
    const id = props.match.params.BroadcastMessageId;
    setBroadcastMessageId(id);
    UserModel.getInstance().getSingleBroadcastMessage(
      id,
      data => {
        console.log('broadcast Message data', data);
        setParams({
          ...params,
          name: data.name
        });
        setSelectedType(typeData[data.type - 1]);
      },
      err => {
        console.log('broadcast Message err', err);
      }
    );
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenData({ openSuccess: false, openError: false });
  };

  const handleChange = event => {
    console.log('name', event.target.name);

    setParams({
      ...params,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async () => {
    const errors = checkForBlanks();
    console.log('errors', errors);
    if (errors) {
      // alert('Fill all required fields');
      setOpenData({ ...openData, openError: true });
    } else {
      let par = new FormData();
      var obj = {
        name: params.name,
        type: selectedType.id,
      };
      await UserModel.getInstance().updateBroadcastMessage(
        broadcastMessageId,
        obj,
        succ => {
          setOpenData({ ...openData, openSuccess: true });
          console.log(succ);
          console.log('props save', props);

          setTimeout(() => {
            props.history.push('/broadcast-messages');
          }, 1000);
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  const checkForBlanks = () => {
    if (
      params.name === '' ||
      !selectedType.id ||
      selectedType.name === ''
    ) {
      return true;
    } else {
      return false;
    }
  };

  const typeHandleChange = async (event, val) => {
    // var arr = event.target.id.split('-')[2];
    await setParams({ ...params, dataFetchStatus: true });
    if (val) {
      await setSelectedType({ id: val.id, name: val.name });
      await setParams({ ...params, dataFetchStatus: false });
    }
  };

  const handleCloser = event => {
    console.log('close');
    // setSelectedProdSku('')
  };


  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Change Broadcast Message" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify broadcast message title"
                  label="Broadcast message title"
                  margin="dense"
                  name="title"
                  onChange={handleChange}
                  required
                  value={params.title}
                  variant="outlined"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="city"
                  options={cityData}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      margin="dense"
                      required
                      label="City"
                      variant="outlined"
                    />
                  )}
                  onChange={cityHandleChange}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify broadcast message"
                  label="Broadcast message"
                  margin="dense"
                  multiline={true}
                  name="text"
                  onChange={handleChange}
                  required
                  value={params.text}
                  variant="outlined"
                />
              </Grid>

              <Snackbar
                open={openData.openSuccess}
                autoHideDuration={6000}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                  Sku successfully updated
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

export default EditBroadcastMessage;
