import React, { useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
// import { Upload } from 'antd';
// import ImgCrop from 'antd-img-crop';

// import 'antd/dist/antd.css';

import Typography from '@material-ui/core/Typography';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardActionArea,
  CardMedia,
  Divider,
  Button,
  Grid,
  TextField
} from '@material-ui/core';
import { isObject } from 'validate.js';

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

var img = null;
const AddProduct = props => {
  var [catData, setCatData] = useState([]);
  var [subcatData, setSubcatData] = useState([]);
  var [selectedCat, setSelectedCat] = useState('');
  var [selectedSubcat, setSelectedSubcat] = useState('');
  var [brandData, setBrandData] = useState([]);
  var [selectedBrandData, setSelectedBrandData] = useState([]);
  var [images, setImages] = useState(null);
  var [imagesFile, setImagesFile] = useState(null);
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });
  const [isExist, setIsExist] = useState(true);
  const [productexist, setProductexist] = useState('');
  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    console.log('file lsit', newFileList[0]);
    if (newFileList[0]) {
      setImagesFile(newFileList[0].originFileObj);
    }

    setFileList(newFileList);
  };

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const beforeUpload = async (file, fileList) => {
    console.log('before upload');
    console.log('file', file);
    console.log('fli list', fileList);
  };

  useEffect(() => {}, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenData({ openSuccess: false, openError: false });
  };

  const classes = useStyles();
  const { className, ...rest } = props;

  const [params, setParams] = useState({
    name: '',
    // code: 'test prod code',
    // cat: 1,
    // subcat: 2,
    brand: '',
    image: '',
    dataFetchStatus: true,
    submitStatus: false
  });

  const handleChange = event => {
    setParams({
      ...params,
      [event.target.name]: event.target.value
    });
    if (event.target.value.length >= 1) {
      UserModel.getInstance().productExist(
        event.target.value,
        succ => {
          if (!succ.exist) {
            console.log('if');
            setProductexist('Product available !');
            setIsExist(true);
          } else {
            console.log('else');
            setProductexist('Product already exist!');
            setIsExist(false);
          }
          console.log('success status', succ);
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  const brandHandleChange = async (event, val) => {
    var arr = event.target.getAttribute('data-option-index');
    console.log('brand val', val);
    if (val) {
      const brandId = setSelectedBrandData({ id: val.id, name: val.name });
    }
  };

  const brandSearch = async (event, value) => {
    await setParams({ ...params, dataFetchStatus: false });
    await UserModel.getInstance().searchBrand(
      { name: value },
      succ => {
        console.log(succ);
        setBrandData(succ);
        setParams({ ...params, dataFetchStatus: true });
      },
      err => {
        console.log(err);
      }
    );
  };

  const isExistCheck = () => {
    if (isExist) {
      return true;
    } else {
      alert('item already exist');
      return false;
    }
  };

  const handleImage = async event => {
    console.log('hadnle image');
    console.log('event iamge', event);
    if (event) {
      img = new Image();
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
      event.target.value = null; //TO CHANGE STATE OF BROWSER
    }
  };

  const deleteImage = async () => {
    await setImages(null);
    await setImagesFile(null);
    img = null;
  };

  const handleSubmit = () => {
    if (!params.submitStatus) {
      const errors = checkForBlanks();
      if (errors) {
        setOpenData({ ...openData, openError: true });
      } else {
        if (isExistCheck()) {
          setParams({ ...params, submitStatus: true });
          console.log('****sub cat', selectedSubcat);

          let par = new FormData();
          if (imagesFile) {
            console.log('with image');
            console.log('images file');
            par.append('image', imagesFile);
            console.log('imag file', imagesFile);
            console.log('paramas', par);
            UserModel.getInstance().uploadImage(
              par,
              succ => {
                console.log('secc', succ);
                var obj = {
                  name: params.name,
                  // code: "prodcode",
                  image: succ.file.location,
                  brand: [selectedBrandData.id],
                  category: [selectedCat.id, selectedSubcat.id]
                };
                console.log('obj', obj);
                UserModel.getInstance().addProduct(
                  obj,
                  succ => {
                    console.log(succ);
                    setOpenData({ ...openData, openSuccess: true });
                    setTimeout(() => {
                      props.history.push('/products');
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
                setParams({ ...params, submitStatus: false });
                console.log(err);
              }
            );
          } else {
            console.log('without image');
            var obj = {
              name: params.name,
              // code: "prodcode",
              image: params.image,
              brand: selectedBrandData ? [selectedBrandData.id] : [0],
              category: [selectedCat.id, selectedSubcat.id]
            };
            UserModel.getInstance().addProduct(
              obj,
              succ => {
                setOpenData({ ...openData, openSuccess: true });
                console.log(succ);
                setTimeout(() => {
                  props.history.push('/products');
                }, 1000);
              },
              err => {
                setParams({ ...params, submitStatus: false });
                console.log(err);
              }
            );
            console.log(obj);
          }

          console.log('selectedCat is ' + selectedCat.name);
        }
      }
    }
  };

  const catChangeHandle = async (event, val) => {
    var arr = event.target.id.split('-')[2];
    console.log('cat val', val);
    if (val) {
      setSelectedCat({
        id: val.id,
        name: val.name
      });
      console.log(selectedCat);
      UserModel.getInstance().getSubCategory(
        val.id,
        async data => {
          await setSelectedSubcat('');
          var tempArray = [];
          data.forEach(obj => {
            tempArray.push({ id: obj.id, name: obj.name });
          });
          setSubcatData(tempArray);
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  const categorySearch = async (event, value) => {
    await setParams({ ...params, dataFetchStatus: false });
    await UserModel.getInstance().searchCategory(
      { name: value },
      succ => {
        console.log(succ);
        setCatData(succ);
        setParams({ ...params, dataFetchStatus: true });
      },
      err => {
        console.log(err);
      }
    );
  };

  const subcatHandleChange = async (event, val) => {
    var arr = event.target.id.split('-')[2];
    console.log('subcat val', val);
    if (val) {
      setSelectedSubcat({
        id: val.id,
        name: val.name
      });
    }
  };

  const checkForBlanks = () => {
    if (params.name === '' || selectedCat === '' || selectedSubcat === '') {
      return true;
    }
  };

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Add Product" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText={productexist}
                  label="Product name"
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
                  id="Brand"
                  options={brandData}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField {...params} label="Brand" variant="outlined" />
                  )}
                  value={selectedBrandData}
                  onChange={brandHandleChange}
                  onInputChange={brandSearch}
                  loading
                  loadingText={
                    params.dataFetchStatus ? 'Loading' : 'No Matches'
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="catSelect"
                  options={catData}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Category"
                      variant="outlined"
                    />
                  )}
                  onChange={catChangeHandle}
                  onInputChange={categorySearch}
                  loading
                  loadingText={
                    params.dataFetchStatus ? 'Loading' : 'No Matches'
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="subcatSelect"
                  options={subcatData}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Subcategory"
                      variant="outlined"
                    />
                  )}
                  onChange={subcatHandleChange}
                  value={selectedSubcat}
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
                        alt="Contemplative Reptile"
                        height="140"
                        image={images}
                        title="Contemplative Reptile"
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
                Product successfully added
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
              Add Product
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default AddProduct;
