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

const AddBanner = props => {
  // console.log(props.location.state);
  const classes = useStyles();
  const { className, ...rest } = props;
  const cityOptions = [
    { id: '1', name: 'Karachi' },
    { id: '2', name: 'Lahore' }
  ];
  var [dealSearchText, setDealSearchText] = useState('');
  var [dealData, setDealData] = useState([]);

  var [prodSkuSearchText, setProdSkuSearchText] = useState('');
  var [prodSkusData, setProdSkusData] = useState([]);

  const typeData = [
    { id: 1, name: 'Deal' },
    { id: 2, name: 'Product Sku' },
    { id: 3, name: 'Link' }
  ];

  var [selectedType, setSelectedType] = useState('');
  var [selectedProdSku, setSelectedProdSku] = useState({});
  var [selectedDeal, setSelectedDeal] = useState({});

  const [is_active, setIsActive] = useState(false);
  var [images, setImages] = useState(null);
  var [imagesFile, setImagesFile] = useState(null);
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });
  // var [searchedProd, setSearchedProd] = useState('');
  const [fileList, setFileList] = useState([]);

  const [params, setParams] = useState({
    name: '',
    link: '',
    dataFetchStatus: true,
    submitStatus: false,
    selectedCity: ''
  });

  // useEffect(() => {
  //   console.log({ params, selectedType, dealData, dealSearchText, selectedDeal, prodSkusData, prodSkuSearchText, selectedProdSku })
  // })

  const handleChange = async event => {
    // console.log('name', event.target.value);
    setParams({
      ...params,
      [event.target.name]: event.target.value
    });
  };

  const dealHandleChange = async (event, val) => {
    console.log('dealHandleChnage function is called', { event });
    await setDealSearchText(event.target.value);
    // var arr = event.target.id.split('-')[2];
    console.log('prod arr', val);

    // const xx = prodSkusData[arr];
    setSelectedDeal({ id: val.id, name: val.name });
    // setParams({
    //   ...params,
    //   // skucode: `001-${val.categories[0].code}-${val.subcategories[0].code}-${val.id}`
    // });
    // console.log('selectedProduct', selectedProdSku);
  };

  const handleCityChange = (event, value) => {
    console.log(value);
    setParams({ ...params, selectedCity: value });
  };

  const dealSearch = async (event, value) => {
    // setSelectedDeal({});
    // console.log({event}, event.target.value)
    await setDealSearchText(event.target.value);
    await setParams({ ...params, dataFetchStatus: false });
    await console.log(dealSearchText);
    UserModel.getInstance().searchDeal(
      {
        'deals.name': value
      },
      succ => {
        console.log(succ);
        let tempArray = [];
        succ &&
          succ.length > 0 &&
          Array.isArray(succ) &&
          succ.forEach(obj => {
            if (obj.name !== null) {
              tempArray.push({ name: obj.name, id: obj.id });
            }
          });
        setDealData(tempArray);
        setParams({ ...params, dataFetchStatus: true });
      },
      err => {
        console.log(err);
      }
    );
  };
  const prodHandleChange = async (event, val) => {
    console.log('prodHandleChnage function is called', { event });
    // var arr = event.target.id.split('-')[2];
    console.log('prod arr', val);

    // const xx = prodSkusData[arr];
    setSelectedProdSku({ id: val.id, name: val.name });
    // setParams({
    //   ...params,
    //   // skucode: `001-${val.categories[0].code}-${val.subcategories[0].code}-${val.id}`
    // });
    // console.log('selectedProduct', selectedProdSku);
  };

  const productSearch = async (event, value) => {
    setSelectedProdSku({});
    console.log({ event }, event.target.value);
    setProdSkuSearchText(event.target.value);
    await setParams({ ...params, dataFetchStatus: false });
    await UserModel.getInstance().globalSearchProductSku(
      [
        {
          text: prodSkuSearchText,
          column_name: 'product_sku.name'
        }
      ],
      {},
      succ => {
        console.log(succ);
        let tempArray = [];
        succ.forEach(obj => {
          if (obj.name !== null) {
            tempArray.push({ name: obj.name, id: obj.id });
          }
        });
        setProdSkusData(succ);
        setParams({ ...params, dataFetchStatus: true });
      },
      err => {
        console.log(err);
      }
    );
  };

  const handleIsActive = event => {
    console.log('check', event.target.checked);
    setIsActive(event.target.checked);
  };

  const checkErrors = () => {
    console.log('selected product sku', selectedProdSku);
    if (
      params.name === '' ||
      !selectedType.id ||
      selectedType.name === '' ||
      (selectedType.id === 1 &&
        (!selectedDeal.id || selectedDeal.name === '')) ||
      (selectedType.id === 2 &&
        (!selectedProdSku.id || selectedProdSku.name === '')) ||
      (selectedType.id === 3 && params.link === '')
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
          name: params.name,
          city_id: params.selectedCity.id,
          type: selectedType.id,
          is_active
        };
        if (selectedType.id === 1) obj = { ...obj, ref_id: selectedDeal.id };
        if (selectedType.id === 2) obj = { ...obj, ref_id: selectedProdSku.id };
        if (selectedType.id === 3) obj = { ...obj, link: params.link };
        if (imagesFile) {
          par.append('image', imagesFile);
          UserModel.getInstance().uploadImage(
            par,
            succ => {
              console.log('secc', succ);
              obj = { ...obj, image: succ.file.location };
              console.log('obj', obj);
              UserModel.getInstance().addBanner(
                obj,
                succ => {
                  console.log(succ);
                  setOpenData({ ...openData, openSuccess: true });
                  setTimeout(() => {
                    props.history.push('/banners');
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
          UserModel.getInstance().addBanner(
            obj,
            succ => {
              setOpenData({ ...openData, openSuccess: true });
              console.log(succ);
              setTimeout(() => {
                props.history.push('/banners');
              }, 1000);
            },
            err => {
              setParams({ ...params, submitStatus: false });
              console.log(obj);
            }
          );
          console.log(obj);
        }
      }
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

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Add Banner" />
          <Divider />

          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify Banner name"
                  label="Banner name"
                  margin="dense"
                  name="name"
                  onChange={handleChange}
                  required
                  value={params.name}
                  variant="outlined"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="type"
                  options={typeData}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      margin="dense"
                      required
                      label="Type"
                      variant="outlined"
                    />
                  )}
                  onChange={typeHandleChange}
                />
              </Grid>

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
                  onChange={handleCityChange}
                />
              </Grid>

              {/* DISPLAYING FIELDS BASED ON BANNER TYPE SELECT */}
              {selectedType.id == 1 && (
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    id="dealSelect"
                    options={dealData}
                    getOptionLabel={option => option.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Select Deal"
                        variant="outlined"
                        required
                        margin="dense"
                      />
                    )}
                    onChange={dealHandleChange}
                    onInputChange={dealSearch}
                    loading
                    loadingText={
                      params.dataFetchStatus ? 'loading' : 'No Matches'
                    }
                  />
                </Grid>
              )}
              {selectedType.id == 2 && (
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    id="prodSkuSelect"
                    options={prodSkusData}
                    getOptionLabel={option => option.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Select Product SKU"
                        variant="outlined"
                        required
                        margin="dense"
                      />
                    )}
                    onChange={prodHandleChange}
                    onInputChange={productSearch}
                    loading
                    loadingText={
                      params.dataFetchStatus ? 'loading' : 'No Matches'
                    }
                  />
                </Grid>
              )}
              {selectedType.id == 3 && (
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    helperText="Specify Link"
                    label="Enter Link"
                    margin="dense"
                    name="link"
                    // type="number"
                    inputProps={{ min: 0 }}
                    min={0}
                    onChange={handleChange}
                    required
                    value={params.link}
                    variant="outlined"
                  />
                </Grid>
              )}

              <Grid item md={6} xs={12}>
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={is_active}
                      onChange={handleIsActive}
                      name="is_active"
                    />
                  }
                  label="Is Active"
                  color="red"
                />
              </Grid>

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
            <Snackbar
              open={openData.openSuccess}
              autoHideDuration={6000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Banner successfully added
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
              Add Banner
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default AddBanner;
