import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { validateNumeric } from '../../common/validators';
import moment from 'moment';
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
import { Upload } from 'antd';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
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

const AddDeal = props => {
  console.log(props.location.state);
  const classes = useStyles();
  const { className, ...rest } = props;
  const [state, setState] = useState([
    { title: 'Id', field: 'id', editable: 'never' },
    { title: 'Sku Name', field: 'name', editable: 'never' }
  ]);
  var [selectedSku, setSelectedSku] = useState([]);
  var [images, setImages] = useState(null);
  var [imagesFile, setImagesFile] = useState(null);
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });
  const cityOptions = [
    { id: '1', name: 'Karachi' },
    { id: '2', name: 'Lahore' }
  ];
  const [stock, setStock] = useState(false);
  const [skuData, setSkuData] = useState([]);
  const [skuDisplayData, setSkuDisplayData] = useState([]);
  const [skuSendingData, setSkuSendingData] = useState([]);
  const [params, setParams] = useState({
    name: '',
    image: '',
    price: '',
    discount: '',
    dataFetchStatus: true,
    submitStatus: false,
    offerName: '',
    timeless: true,
    time: '',
    startDate: '',
    endDate: '',
    startDateObj: '',
    endDateObj: '',
    selectedCity: ''
  });

  useEffect(() => {
    // UserModel.getInstance().getSupplier(
    //   null,
    //   data => {
    //     console.log(data);
    //     let tempArray = [];
    //     data.forEach(obj => {
    //       if (obj.name !== null) {
    //         tempArray.push({ name: obj.name, id: obj.id });
    //       }
    //     });
    //     setSupplierData(tempArray);
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  }, []);

  const handleChange = async event => {
    console.log('validate', validateNumeric(event.target.value));
    console.log('length', event.target.value.length);
    console.log('name', event.target.name);

    if (!validateNumeric(event.target.value) && event.target.name == 'price') {
      await setParams({
        ...params,
        [event.target.name]: {}
      });
    } else {
      setParams({
        ...params,
        [event.target.name]: event.target.value
      });
    }
  };

  const skuHandleChange = async (event, val) => {
    if (val) {
      console.log('SKU value', val);
      setSelectedSku(val);
      // setParams({
      //   ...params,
      //   selectedSku: { id: val.id, name: val.name }
      // });
    }
  };

  const skuSearch = async (event, value) => {
    // setParams({ ...params, selectedSku: {} });
    if (value) {
      await setParams({ ...params, dataFetchStatus: false });
      await UserModel.getInstance().searchSku(
        { 'product_sku.name': value, is_deal: true },
        succ => {
          // console.log(succ);
          // var tempArr = [];
          // succ.forEach(sku => {
          //   tempArr.push({ name: sku.name, id: sku.id });
          // });
          setSkuData(succ);
          setParams({ ...params, dataFetchStatus: true });
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  const checkErrors = async () => {
    // console.log(selectedSku.name);
    // console.log(params.price);
    // console.log(params.offerName);
    if (params.timeless) {
      if (
        skuSendingData.length === 0 ||
        params.selectedCity === '' ||
        params.offerName === ''
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        selectedSku.name === undefined ||
        params.price === '' ||
        params.offerName === '' ||
        params.startDate === '' ||
        params.endDate === ''
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenData({ openSuccess: false, openError: false });
  };

  const handleTimeless = event => {
    console.log(event.target.checked);
    setParams({ ...params, timeless: event.target.checked });
  };

  const handleSubmit = async () => {
    console.log('params.startDateObj', skuDisplayData);
    await UserModel.getInstance().dealCheckSku(
      { id: selectedSku.id },
      succ => {
        console.log(succ);
        alert('Selected SKU already exists in a deal. Select a unique');
      },
      async err => {
        console.log(err);
        if (!params.submitStatus) {
          const errors = await checkErrors();
          if (errors) {
            setOpenData({ ...openData, openError: true });
          } else {
            setParams({ ...params, submitStatus: true });
            let par = new FormData();
            if (imagesFile) {
              par.append('image', imagesFile);
              UserModel.getInstance().uploadImage(
                par,
                succ => {
                  var obj = {};
                  if (!params.timeless) {
                    obj = {
                      name: params.offerName,
                      image: succ.file.location,
                      start_time: params.startDateObj,
                      end_time: params.endDateObj,
                      is_unlimit: params.timeless,
                      city_id: params.selectedCity.id,
                      skus: skuSendingData
                    };
                    console.log('obj', obj);
                  } else {
                    obj = {
                      name: params.offerName,
                      image: succ.file.location,
                      start_time: moment().local(),
                      end_time: moment().local(),
                      is_unlimit: params.timeless,
                      city_id: params.selectedCity.id,
                      skus: skuSendingData
                    };
                    console.log('obj', obj);
                  }
                  UserModel.getInstance().addDeal(
                    obj,
                    succ => {
                      setOpenData({ ...openData, openSuccess: true });
                      setTimeout(() => {
                        props.history.push('/deal-manager');
                      }, 1000);
                    },
                    err => {
                      setParams({ ...params, submitStatus: false });
                      console.log(err);
                    }
                  );
                  console.log(obj);
                },
                err => {
                  console.log(err);
                  setParams({ ...params, submitStatus: false });
                }
              );
            } else {
              var obj = {};
              if (!params.timeless) {
                console.log(params.startDateObj);
                obj = {
                  name: params.offerName,
                  start_time: params.startDateObj,
                  end_time: params.endDateObj,
                  is_unlimit: params.timeless,
                  city_id: params.selectedCity.id,
                  skus: skuSendingData
                };
                UserModel.getInstance().addDeal(
                  obj,
                  succ => {
                    setOpenData({ ...openData, openSuccess: true });
                    console.log(succ);
                    setTimeout(() => {
                      props.history.push('/deal-manager');
                    }, 1000);
                  },
                  err => {
                    setParams({ ...params, submitStatus: false });
                    console.log(obj);
                  }
                );
              } else {
                obj = {
                  name: params.offerName,
                  start_time: moment().local(),
                  end_time: moment().local(),
                  is_unlimit: params.timeless,
                  city_id: params.selectedCity.id,
                  skus: skuSendingData
                };
                UserModel.getInstance().addDeal(
                  obj,
                  succ => {
                    setOpenData({ ...openData, openSuccess: true });
                    console.log(succ);
                    setTimeout(() => {
                      props.history.push('/deal-manager');
                    }, 1000);
                  },
                  err => {
                    setParams({ ...params, submitStatus: false });
                    console.log(obj);
                  }
                );
              }

              console.log(obj);
            }
          }
        }
      }
    );
  };

  const deleteImage = async () => {
    await setImages(null);
    await setImagesFile(null);
  };

  const handleImage = async event => {
    console.log('event image', event.target.files[0]);
    if (event) {
      let img = new Image();
      let flag = false;
      img.fil = event.target.files[0];
      img.src = URL.createObjectURL(event.target.files[0]);
      img.onload = () => {
        if (img.width <= 500 && img.height <= 500) {
          setImagesFile(img.fil);
          console.log('img src', img.src);
          setImages(img.src);
        } else {
          alert('Max size allowed 500x500');
        }
      };
      event.target.value = null;
    }
  };

  const dateChanger = async event => {
    const eventName = event.target.id;
    const originalDate = event.target.value;
    const dateArr = event.target.value.split('T');
    var dateString = '';
    await dateArr.forEach(elem => {
      dateString += ' ' + elem;
    });
    dateString += ':00';
    dateString = dateString.trim();
    console.log(dateString.trim());
    if (eventName === 'startDate') {
      setParams({
        ...params,
        startDate: originalDate,
        startDateObj: dateString
      });
    }
    if (eventName === 'endDate') {
      setParams({ ...params, endDate: originalDate, endDateObj: dateString });
    }
  };

  const handleCityCHange = (event, value) => {
    console.log(value);
    setParams({ ...params, selectedCity: value });
  };

  const handleAddSku = () => {
    setSkuDisplayData([
      ...skuDisplayData,
      { id: selectedSku.id, name: selectedSku.name }
    ]);
    setSkuSendingData([
      ...skuSendingData,
      {
        sku_id: selectedSku.id,
        price: selectedSku.price,
        discount: selectedSku.discount
      }
    ]);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3} direction="row">
        <Grid item spacing={3} direction="column" md={5}>
          <Card {...rest} className={clsx(classes.root, className)}>
            <form autoComplete="off" noValidate>
              <CardHeader title="Add an Offer" />
              <Divider />

              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      helperText="Offer Name"
                      label="Offer Name"
                      name="offerName"
                      onChange={handleChange}
                      required
                      value={params.offerName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="sku"
                      options={skuData}
                      getOptionLabel={option => option.name}
                      renderInput={params => (
                        <TextField
                          {...params}
                          margin="dense"
                          label="SKU"
                          variant="outlined"
                        />
                      )}
                      onChange={skuHandleChange}
                      onInputChange={skuSearch}
                      value={selectedSku}
                    />
                  </Grid>
                  {/* <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      helperText="Specify Price"
                      label="Price"
                      // margin="dense"
                      name="price"
                      type="number"
                      inputProps={{ min: 0 }}
                      min={0}
                      onChange={handleChange}
                      required
                      value={params.price}
                      variant="outlined"
                    />
                  </Grid> */}

                  {/* <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      helperText="Discount"
                      label="Discount"
                      // margin="dense"
                      name="discount"
                      type="number"
                      inputProps={{ min: 0 }}
                      min={0}
                      onChange={handleChange}
                      required
                      value={params.discount}
                      variant="outlined"
                    />
                  </Grid> */}

                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="city"
                      options={cityOptions}
                      getOptionLabel={option => option.name}
                      renderInput={params => (
                        <TextField
                          {...params}
                          margin="dense"
                          label="City"
                          variant="outlined"
                        />
                      )}
                      onChange={handleCityCHange}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControlLabel
                      control={
                        <GreenCheckbox
                          checked={params.timeless}
                          onChange={handleTimeless}
                          name="stock"
                        />
                      }
                      label="Timeless Deal"
                      color="red"
                    />
                  </Grid>
                  {params.timeless ? null : (
                    <Grid item md={6} xs={12}>
                      <form className={classes.container} noValidate>
                        <TextField
                          id="startDate"
                          label="Start deal at"
                          type="datetime-local"
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true
                          }}
                          value={params.startDate}
                          onChange={dateChanger}
                        />
                      </form>
                      <br />
                      <Grid item md={6} xs={12}>
                        <form className={classes.container} noValidate>
                          <TextField
                            id="endDate"
                            label="End deal at"
                            type="datetime-local"
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true
                            }}
                            value={params.endDate}
                            onChange={dateChanger}
                          />
                        </form>
                      </Grid>
                    </Grid>
                  )}
                  <Grid item md={6} xs={12}>
                    <input
                      accept="image/*"
                      className={classes.input}
                      id="contained-button-file"
                      multiple
                      type="file"
                      onChange={handleImage}
                    />
                    <label htmlFor="contained-button-file">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        startIcon={<CloudUploadIcon />}>
                        Upload Image
                      </Button>
                    </label>

                    {images ? (
                      <Card className={classes.cardroot}>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="140"
                            image={images}
                            title="image"
                          />
                        </CardActionArea>
                        <CardActions>
                          <Button
                            size="small"
                            color="secondary"
                            onClick={deleteImage}>
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    ) : null}
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button
                  color="primary"
                  // variant="contained"
                  onClick={handleAddSku}>
                  Add SKU
                </Button>
              </CardActions>

              <Divider />
              <CardActions>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={params.submitStatus ? null : handleSubmit}>
                  Add Offer
                </Button>
              </CardActions>
            </form>
          </Card>
        </Grid>
        <Grid item spacing={3} direction="column" md={7}>
          <Grid item>
            <MaterialTable
              title="Deal SKUs"
              columns={state}
              data={skuDisplayData}
              className={clsx(classes.root, className)}
              options={{
                paging: false,
                search: false
              }}
              actions={[
                {
                  icon: 'delete',
                  tooltip: 'Delete Route',
                  onClick: (event, data) => {
                    const newArr = skuDisplayData.filter(dealSku => {
                      return dealSku.id === data.id;
                    });
                    setSkuDisplayData(newArr);
                    console.log('ddata', data);
                  }
                }
              ]}></MaterialTable>
          </Grid>
        </Grid>
        <Snackbar
          open={openData.openSuccess}
          autoHideDuration={6000}
          onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Sku successfully added
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
    </div>
  );
};

export default AddDeal;
