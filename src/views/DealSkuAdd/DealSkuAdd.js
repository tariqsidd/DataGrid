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
  FormControlLabel
} from '@material-ui/core';
import { Upload } from 'antd';
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

const DealSkuAdd = props => {
  // console.log(props.location.state);
  const classes = useStyles();
  const { className, ...rest } = props;
  var [prodData, setProdData] = useState([]);
  var [supplierData, setSupplierData] = useState([]);
  var [selectedSupplier, setSelectedSupplier] = useState('');
  var [selectedProd, setSelectedProd] = useState({});
  var [images, setImages] = useState(null);
  var [imagesFile, setImagesFile] = useState(null);
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });
  const [stock, setStock] = useState(false);
  // var [searchedProd, setSearchedProd] = useState('');
  const [fileList, setFileList] = useState([]);

  const [params, setParams] = useState({
    name: '',
    skucode: '',
    prod: '',
    image: '',
    price: '',
    weight: '',
    discount: '',
    dataFetchStatus: true,
    submitStatus: false
  });

  useEffect(() => {
    UserModel.getInstance().getSupplier(
      null,
      data => {
        console.log(data);
        let tempArray = [];
        data.forEach(obj => {
          if (obj.name !== null) {
            tempArray.push({ name: obj.name, id: obj.id });
          }
        });
        setSupplierData(tempArray);
      },
      err => {
        console.log(err);
      }
    );
  }, []);

  const handleStock = event => {
    console.log('check', event.target.checked);
    setStock(event.target.checked);
  };

  const handleChange = async event => {
    // console.log('validate', validateNumeric(event.target.value));
    // console.log('length', event.target.value.length);
    // console.log('name', event.target.name);

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

  const prodHandleChange = async (event, val) => {
    var arr = event.target.id.split('-')[2];
    console.log('prod arr', val);

    const xx = prodData[arr];
    setSelectedProd({ id: val.id, name: val.name });
    setParams({
      ...params,
      skucode: `001-${val.categories[0].code}-${val.subcategories[0].code}-${val.id}`
    });
    console.log('selectedProduct', selectedProd);
  };

  const productSearch = async (event, value) => {
    setSelectedProd({});
    await setParams({ ...params, dataFetchStatus: false });
    await UserModel.getInstance().searchProduct(
      { 'products.name': value },
      succ => {
        console.log(succ);
        // let tempArray = [];
        //   succ.forEach(obj => {
        //     if (obj.name !== null) {
        //       tempArray.push({ name: obj.name, id: obj.id });
        //     }
        //   });
        setProdData(succ);
        setParams({ ...params, dataFetchStatus: true });
      },
      err => {
        console.log(err);
      }
    );
  };

  const supplierHandleChange = async (event, val) => {
    var arr = event.target.id.split('-')[2];
    await setParams({ ...params, dataFetchStatus: true });
    if (val) {
      await setSelectedSupplier({ id: val.id, name: val.name });
      await setParams({ ...params, dataFetchStatus: false });
    }
  };

  const checkErrors = () => {
    console.log('bloody product status', selectedProd);
    if (
      selectedProd.name === undefined ||
      params.price === '' ||
      params.name === '' ||
      selectedSupplier.id === undefined ||
      params.discount === ''
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
        if (imagesFile) {
          par.append('image', imagesFile);
          UserModel.getInstance().uploadImage(
            par,
            succ => {
              console.log('secc', succ);
              var obj = {
                name: params.name,
                code: params.skucode,
                supplier: [selectedSupplier.id],
                price: params.price,
                discount: 0.0,
                stock: 0,
                is_deal: true,
                is_stock: stock,
                product_id: selectedProd.id,
                image: succ.file.location
              };
              console.log('obj', obj);
              UserModel.getInstance().addSku(
                obj,
                succ => {
                  console.log(succ);
                  setOpenData({ ...openData, openSuccess: true });
                  setTimeout(() => {
                    props.history.push('/skus');
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
          var obj = {
            name: params.name,
            code: params.skucode,
            supplier: [selectedSupplier.id],
            price: params.price,
            discount: params.discount,
            stock: 0,
            is_deal: true,
            product_id: selectedProd.id,
            image: params.image,
            is_stock: stock
          };
          UserModel.getInstance().addSku(
            obj,
            succ => {
              setOpenData({ ...openData, openSuccess: true });
              console.log(succ);
              setTimeout(() => {
                props.history.push('/skus');
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
          <CardHeader title="Add SKU for Deal" />
          <span style={{ fontSize: 12 }}>
            SKUs created here will be only shown in the deals section of the
            mobile app.
          </span>
          <Divider />

          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify Sku name"
                  label="Sku name"
                  margin="dense"
                  name="name"
                  onChange={handleChange}
                  required
                  value={params.name}
                  variant="outlined"
                />
              </Grid>
              {/* <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Sku Code"
                  margin="dense"
                  name="skucode"
                  onChange={handleChange}
                  required
                  value={params.skucode}
                  variant="outlined"
                  disabled
                />
              </Grid> */}

              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="prodSelect"
                  options={prodData}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Product"
                      variant="outlined"
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

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify Price"
                  label="Price"
                  margin="dense"
                  name="price"
                  type="number"
                  inputProps={{ min: 0 }}
                  min={0}
                  onChange={handleChange}
                  required
                  value={params.price}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify Discount"
                  label="Discount"
                  margin="dense"
                  name="discount"
                  type="number"
                  inputProps={{ min: 0 }}
                  min={0}
                  onChange={handleChange}
                  required
                  value={params.discount}
                  variant="outlined"
                />
              </Grid>
              {/* <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify Weight"
                  label="Weight in KG"
                  margin="dense"
                  name="weight"
                  type="number"
                  inputProps={{ min: 0 }}
                  min={0}
                  onChange={handleChange}
                  required
                  value={params.weight}
                  variant="outlined"
                />
              </Grid> */}

              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="supplier"
                  options={supplierData}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      margin="dense"
                      label="Supplier"
                      variant="outlined"
                    />
                  )}
                  onChange={supplierHandleChange}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={stock}
                      onChange={handleStock}
                      name="stock"
                    />
                  }
                  label="Out of stock"
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
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="contained"
              onClick={params.submitStatus ? null : handleSubmit}>
              Add Sku
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default DealSkuAdd;
