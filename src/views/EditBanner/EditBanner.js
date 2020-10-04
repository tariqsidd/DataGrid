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

const EditBanner = props => {
  // console.log(props.location.state);
  const classes = useStyles();
  const { className, ...rest } = props;
  var [bannerId, setBannerId] = useState('');

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
    deal: '',
    productSku: '',
    link: '',
    dataFetchStatus: true,
    submitStatus: false
  });

  // useEffect(() => {
  //   console.log({ params, selectedType, dealData, dealSearchText, selectedDeal, prodSkusData, prodSkuSearchText, selectedProdSku })
  // })

  useEffect(() => {
    console.log({ props });
    console.log('************** props params', props.match.params.bannerId);
    const id = props.match.params.bannerId;
    setBannerId(id);
    UserModel.getInstance().getSingleBanner(
      id,
      data => {
        console.log('banner data', data);
        setParams({
          ...params,
          name: data.name
        });
        setSelectedType(typeData[data.type - 1]);

        // setSelectedSupplier({
        //   id: data.supplier[0].id,
        //   name: data.supplier[0].name
        // });
        data.type === 1 &&
          setSelectedDeal({ id: data.deal.id, name: data.deal.name });
        data.type === 2 &&
          setSelectedProdSku({ id: data.sku.id, name: data.sku.name });
        data.type === 3 && setParams({ ...params, link: data.link });
        setImages(data.image);
        setIsActive(data.is_active);
      },
      err => {
        console.log('banner err', err);
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
        is_active
      };
      console.log({ selectedType });
      if (selectedType.id === 1) obj = { ...obj, ref_id: selectedDeal.id };
      if (selectedType.id === 2) obj = { ...obj, ref_id: selectedProdSku.id };
      if (selectedType.id === 3) obj = { ...obj, link: params.link };
      if (imagesFile) {
        console.log('images file');
        par.append('image', imagesFile);
        console.log('imag file', imagesFile);
        console.log('paramas', par);
        await UserModel.getInstance().uploadImage(
          par,
          succ => {
            console.log('secc', succ);
            obj = { ...obj, image: succ.file.location };
            console.log('banner id', bannerId);
            UserModel.getInstance().updateBanner(
              bannerId,
              obj,
              succ => {
                setOpenData({ ...openData, openSuccess: true });
                console.log(succ);
                console.log('props save', props);

                setTimeout(() => {
                  props.history.push('/banners');
                }, 1000);
              },
              err => {
                console.log(err);
              }
            );

            console.log('edit obj', obj);
          },
          err => {
            console.log(err);
          }
        );
      } else {
        await UserModel.getInstance().updateBanner(
          bannerId,
          obj,
          succ => {
            setOpenData({ ...openData, openSuccess: true });
            console.log(succ);
            console.log('props save', props);

            setTimeout(() => {
              props.history.push('/banners');
            }, 1000);
          },
          err => {
            console.log(err);
          }
        );
        console.log('ooobj', obj);
      }
    }
  };

  const dealHandleChange = async (event, val) => {
    if (val) {
      console.log('dealHandleChnage function is called', { event });
      // var arr = event.target.id.split('-')[2];
      console.log('prod arr', val);

      // const xx = prodSkusData[arr];
      setSelectedDeal({ id: val.id, name: val.name });
      // setParams({
      //   ...params,
      //   // skucode: `001-${val.categories[0].code}-${val.subcategories[0].code}-${val.id}`
      // });
      // console.log('selectedProduct', selectedProdSku);
    }
  };

  const dealSearch = async (event, value) => {
    if (event !== null) {
      console.log({ event }, event.target.value);
      await setDealSearchText(event.target.value);
      await setParams({ ...params, dataFetchStatus: false });
      await UserModel.getInstance().searchDeal(
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
    }
  };

  const prodHandleChange = async (event, val) => {
    var arr = event.target.id.split('-')[2];
    if (val) {
      console.log('arr');

      setSelectedProdSku({ id: val.id, name: val.name });
      setParams({
        ...params
        // skucode: `001-${val.categories[0].code}-${val.subcategories[0].code}-${val.id}`
      });
      console.log('select', selectedProdSku);
    }
  };

  const productSearch = async (event, value) => {
    console.log('product search', { event });
    if (event !== null) {
      await setParams({ ...params, dataFetchStatus: false });
      setDealSearchText(value);
      UserModel.getInstance().searchProduct(
        { 'products.name': value, offset: 0 },
        succ => {
          console.log(succ);
          setProdSkusData(succ);
          setParams({ ...params, dataFetchStatus: true });
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  const handleIsActive = event => {
    console.log('check', event.target.checked);
    setIsActive(event.target.checked);
  };

  const checkForBlanks = () => {
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
    console.log('event image', event);
    if (event) {
      let img = new Image();
      let flag = false;
      img.fil = event.target.files[0];
      img.src = URL.createObjectURL(event.target.files[0]);
      img.onload = () => {
        if (img.width <= 500 && img.height <= 500) {
          setImagesFile(img.fil);

          setImages(img.src);
        } else {
          alert('Max size allowed 500x500');
        }
      };
      event.target.value = null;
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
          <CardHeader title="Change Banner" />
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
                  value={selectedType}
                  renderInput={params => (
                    <TextField
                      {...params}
                      margin="dense"
                      label="Type"
                      required
                      variant="outlined"
                    />
                  )}
                  onChange={typeHandleChange}
                />
              </Grid>

              {/* DISPLAYING FIELDS BASED ON BANNER TYPE SELECTEDDDDD */}
              {selectedType.id === 1 && (
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    id="dealSelect"
                    options={dealData}
                    getOptionLabel={option => option.name}
                    value={selectedDeal}
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
                    value={selectedProdSku}
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
                    {images ? (
                      <span>Update Image</span>
                    ) : (
                      <span>Upload Image</span>
                    )}
                  </Button>
                </label>

                {images ? (
                  <Card className={classes.cardroot}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        alt={params.name}
                        height="140"
                        image={images}
                        title={params.name}
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

export default EditBanner;
