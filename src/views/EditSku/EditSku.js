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
import {validateNumeric} from '../../common/validators'
import { withStyles } from '@material-ui/core/styles';

const GreenCheckbox = withStyles({
  root: {
    color: 'orange',
    '&$checked': {
      color: 'orange',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

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

const EditSku = props => {
  var [prodData, setProdData] = useState([]);
  var [selectedProd, setSelectedProd] = useState({});
  var [supplierData, setSupplierData] = useState([]);
  var [selectedSupplier, setSelectedSupplier] = useState([]);
  var [skuId, setSkuId] = useState();
  const [stock, setStock] = useState(true);
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });
  const [params, setParams] = useState({
    name: '',
    skucode: '',
    brand: '',
    image: '',
    price: 0,
    discount:'',
    dataFetchStatus: false
  });
  var [imagesFile, setImagesFile] = useState(null);
  var [images, setImages] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    console.log('************** props params', props.match.params.id);
    const id = props.match.params.id;
    setSkuId(id);
    UserModel.getInstance().getSingleSku(
      id,
      data => {
        console.log('sku data',data);
        setParams({
          ...params,
          name: data.name,
          image: (data.image)? data.image[0] : '',
          price: data.price,
          discount: data.discount,
          skucode: data.code
        });
        setStock(data.is_stock);
        setSelectedSupplier({
          id: data.supplier[0].id,
          name: data.supplier[0].name
        });
        setSelectedProd({ id: data.product.id, name: data.product.name });
        setImages(data.image);
      },
      err => {
        console.log('sku err',err);
      }
    );

    UserModel.getInstance().getSupplier(
      null,
      data => {
        var tmpArray = [];
        data.forEach(obj => {
          tmpArray.push({ id: obj.id, name: obj.name });
        });
        setSupplierData(tmpArray);
      },
      err => {
        console.log(err);
      }
    );
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenData({ openSuccess: false, openError: false });
  };

  const classes = useStyles();
  const { className, ...rest } = props;

  const handleChange = event => {
    // console.log('validate',validateNumeric(event.target.value))
    // console.log('length', event.target.value.length)
    // console.log('name',event.target.name)
    
    if(!validateNumeric(event.target.value) && (event.target.name=='price')){
      setParams({
        ...params,
        [event.target.name]: {}
      })     
    }
    else{
      setParams({
        ...params,
        [event.target.name]: event.target.value
      });
    }
    
  };

  const handleStock = (event) => {
    console.log('check',event.target.checked)
    setStock(event.target.checked);

  };
 

  const handleSubmit = async () => {
    const errors = checkForBlanks();
    console.log('errors', errors);
    if (errors) {
      // alert('Fill all required fields');
      setOpenData({ ...openData, openError: true });
    } else {
      let par = new FormData();
      if (imagesFile) {
        console.log('images file');
        par.append('image', imagesFile);
        console.log('imag file', imagesFile);
        console.log('paramas', par);
        await UserModel.getInstance().uploadImage(
          par,
          succ => {
            console.log('secc', succ);
            var obj = {
              name: params.name,
              code: params.skucode,
              supplier: [selectedSupplier.id],
              product_id: selectedProd.id,
              price: params.price,
              discount: params.discount,
              stock: 0,
              image: succ.file.location,
              is_stock:stock
            };
            console.log('prod id', skuId);
            UserModel.getInstance().updateSku(
              skuId,
              obj,
              succ => {
                setOpenData({ ...openData, openSuccess: true });
                console.log(succ);
                console.log('props save', props);

                setTimeout(() => {
                  props.history.push('/skus');
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
        var obj = {
          name: params.name,
          code: params.skucode,
          supplier: [selectedSupplier.id],
          product_id: selectedProd.id,
          price: params.price,
          discount: params.discount,
          stock: 0,
          image: images,
          is_stock:stock
        };
        await UserModel.getInstance().updateSku(
          skuId,
          obj,
          succ => {
            setOpenData({ ...openData, openSuccess: true });
            console.log(succ);
            console.log('props save', props);

            setTimeout(() => {
              props.history.push('/skus');
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

  const prodHandleChange = async (event,val) => {
    var arr = event.target.id.split('-')[2];
    if (val) {
      console.log('arr');
      
      setSelectedProd({id:val.id,name:val.name});
      setParams({
        ...params,
        skucode: `001-${val.categories[0].code}-${val.subcategories[0].code}-${val.id}`
      });
      console.log('select', selectedProd);
    }
  };

  const productSearch = async (event, value) => {
  console.log('product search')
    await setParams({ ...params, dataFetchStatus: false });
    UserModel.getInstance().searchProduct(
      { 'products.name': value , "offset":0},
      succ => {
        console.log(succ);
        setProdData(succ);
        setParams({ ...params, dataFetchStatus: true });
      },
      err => {
        console.log(err);
      }
    );
  };

  const supplierHandleChange = async (event,val) => {
    var arr = event.target.id.split('-')[2];
    if (val) {
      setSelectedSupplier({id:val.id,name:val.name});
    }
  };

  // const brandHandleChange = async event => {
  //   var arr = event.target.id.split('-')[2];
  //   if (arr) {
  //     setSelectedBrand(brandData[arr]);
  //   }
  // };

  const checkForBlanks = () => {
    if (
      params.name === '' ||
      selectedProd.length === 0 ||
      selectedSupplier.id === undefined ||
      params.price === ''||
      params.discount===""
    ) {
      return true;
    } else {
      return false;
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

  const handleCloser = (event) => {
    console.log('close')
    // setSelectedProd('')
  }

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Change Sku" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify sku name"
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
                <Autocomplete
                  id="brand"
                  options={brandData}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField {...params} label="Brand" variant="outlined" />
                  )}
                  onChange={brandHandleChange}
                />
              </Grid> */}

              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="prodSelect"
                  options={prodData}
                  getOptionLabel={option => option.name}
                  value={selectedProd}
                  renderInput={params => (
                    <TextField {...params} label="Product" variant="outlined" />
                  )}
                  onChange={prodHandleChange}
                
                  onClose={handleCloser()}
                  onInputChange={productSearch}
                  loading
                  loadingText={
                    params.dataFetchStatus ? 'Loading' : 'No Matches'
                  }
                />
              </Grid>

              {/* <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify Sku code"
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
                  id="supplier"
                  options={supplierData}
                  getOptionLabel={option => option.name}
                  value={selectedSupplier}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Supplier"
                      variant="outlined"
                    />
                  )}
                  onChange={supplierHandleChange}
                />
              </Grid>

         

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="price"
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
                  label="Discount"
                  helperText="Specify discount"
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

              <Grid item md={6} xs={12}>
                <FormControlLabel
            control={<GreenCheckbox checked={stock} onChange={handleStock} name="stock" />}
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

export default EditSku;
