import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { validateNumeric } from '../../common/validators';
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
  FormControlLabel,
  MenuItem
} from '@material-ui/core';
// import { Upload } from 'antd';
import { withStyles } from '@material-ui/core/styles';
// import 'antd/dist/antd.css';

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

const AddBroadcastMessage = props => {
  // console.log(props.location.state);
  const classes = useStyles();
  const { className, ...rest } = props;

  var [cityData, setCityData] = useState([]);
  var [selectedCity, setSelectedCity] = useState({});

  // const [is_active, setIsActive] = useState(false);
  // var [images, setImages] = useState(null);
  // var [imagesFile, setImagesFile] = useState(null);
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });
  // var [searchedProd, setSearchedProd] = useState('');
  // const [fileList, setFileList] = useState([]);

  const [params, setParams] = useState({
    title: '',
    text: '',
    dataFetchStatus: true,
    submitStatus: false
  });

  // useEffect(() => {
  //   console.log({ params, selectedCity, dealData, dealSearchText, selectedDeal, prodSkusData, prodSkuSearchText, selectedProdSku })
  // })

  useEffect(() => {
    UserModel.getInstance().getCities(
      null,
      async data => {
        // console.log('city data', data);

        let tempArr = [];
        // console.log(data);
        await data.forEach(obj => {
          // console.log('city', obj)
          tempArr.push({
            id: obj.id,
            name: obj.name
            // is_active: obj.is_active ? 'active' : 'de-active'
          });
        });
        setCityData(tempArr);
      },
      err => {
        console.log('city err', err);
      }
    );
  }, []);

  const handleChange = async event => {
    // console.log('name', event.target.value);
    // if (event.target.name === 'title' || event.target.name === 'text') {
    //   if ((event.target.name === 'title' && params.title.length <= 30) || (event.target.name === 'text' && params.text.length <= 100)) {
    setParams({
      ...params,
      [event.target.name]: event.target.value
    });
    //   }
    // } else {
    //   setParams({
    //     ...params,
    //     [event.target.name]: event.target.value
    //   });
    // }
  };

  const checkErrors = () => {
    console.log('selected city', selectedCity);
    if (
      params.title === '' ||
      params.text === '' ||
      !selectedCity.id ||
      selectedCity.name === ''
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

  const handleSubmit = () => {
    if (!params.submitStatus) {
      const errors = checkErrors();
      if (errors) {
        setOpenData({ ...openData, openError: true });
      } else {
        setParams({ ...params, submitStatus: true });
        let par = new FormData();
        var obj = {
          title: params.title,
          text: params.text,
          city_id: selectedCity.id
          // is_active
        };
        UserModel.getInstance().addBroadcastMessage(
          obj,
          succ => {
            setOpenData({ ...openData, openSuccess: true });
            console.log(succ);
            setTimeout(() => {
              props.history.push('/broadcast-messages');
            }, 1000);
          },
          err => {
            setParams({ ...params, submitStatus: false });
            console.log(obj);
          }
        );
      }
    }
  };

  useEffect(() => {
    console.log({ params });
  });

  const cityHandleChange = async (event, val) => {
    // var arr = event.target.id.split('-')[2];
    await setParams({ ...params, dataFetchStatus: true });
    if (val) {
      await setSelectedCity({ id: val.id, name: val.name });
      await setParams({ ...params, dataFetchStatus: false });
    }
  };

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Add Broadcast Message" />
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
            </Grid>
            <Snackbar
              open={openData.openSuccess}
              autoHideDuration={6000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Broadcast message successfully added
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
            <Button
              color="primary"
              variant="contained"
              onClick={params.submitStatus ? null : handleSubmit}>
              Add Broadcast message
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default AddBroadcastMessage;
