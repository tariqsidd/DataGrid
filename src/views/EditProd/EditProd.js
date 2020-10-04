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
  TextField
} from '@material-ui/core';

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

const EditProd = props => {
  var [catData, setCatData] = useState([]);
  var [subcatData, setSubcatData] = useState([]);
  var [selectedCat, setSelectedCat] = useState({});
  var [selectedSubcat, setSelectedSubcat] = useState('');
  var [prodId, setProdId] = useState('');
  var [brandData, setBrandData] = useState([]);
  var [selectedBrandData, setSelectedBrandData] = useState(0);
  var [imagesFile, setImagesFile] = useState(null);
  var [images, setImages] = useState(null);
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });

  const [params, setParams] = useState({
    name: '',
    brand: 0,
    image: '',
    selectedCat: {},
    selectedSubcat: {},
    selectedBrandData: {},
    openSuccess: false,
    openError: false,
    dataFetchStatus: false
  });
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
  useEffect(() => {
    console.log('************** props params', props.match.params.id);
    setProdId(props.match.params.id);
    UserModel.getInstance().getEditProduct(
      props.match.params.id,
      function success(data) {
        console.log('respnse from getproduct', data);
        setParams({
          ...params,
          name: data.name,
          brand: 0,
          image: data.image,
          selectedCat: {
            id: data.categories[0].id,
            name: data.categories[0].name
          },
          selectedSubcat: {
            id: data.subcategories[0].id,
            name: data.subcategories[0].name
          },
          selectedBrandData: { id: data.brand_id, name: data.brand_name }
        });
        setSelectedCat({
          id: data.categories[0].id,
          name: data.categories[0].name
        });
        setImages(data.image);
        // setImagesFile(data.image);
        UserModel.getInstance().getSubCategory(
          data.categories[0].id,
          data => {
            let tempArray = [];
            data.forEach(obj => {
              tempArray.push({ name: obj.name, id: obj.id });
              console.log('calling');
            });
            setSubcatData(tempArray);
          },
          err => {
            console.log(err);
          }
        );
      },
      function failure(params) {
        console.log('failure get product ', params);
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
    setParams({ ...params, openSuccess: false, openError: false });
  };

  const handleSubmit = async () => {
    const errors = checkForBlanks();
    console.log('errors', errors);
    if (errors) {
      // alert('Fill all required fields');
      setParams({ ...params, openError: true });
    } else {
      let par = new FormData();
      if (imagesFile) {
        console.log('images file');
        par.append('image', imagesFile);

        await UserModel.getInstance().uploadImage(
          par,
          succ => {
            console.log('secc', succ);
            var obj = {
              name: params.name,
              image: succ.file.location,
              brand: [params.selectedBrandData.id],
              category: [selectedCat.id, params.selectedSubcat.id]
            };
            console.log('sub cate', subcatData);
            console.log('prod id', prodId);
            UserModel.getInstance().updateProduct(
              prodId,
              obj,
              succ => {
                setParams({ ...params, openSuccess: true });
                console.log(succ);
                console.log('props save', props);

                setTimeout(() => {
                  props.history.push('/products');
                }, 1000);
              },
              err => {
                console.log(err);
              }
            );

            console.log('edit obj', obj);
          },
          err => {
            console.log('img err', err);
            alert('Cannot upload Image');
          }
        );
      } else {
        var obj = {
          name: params.name,
          image: images,
          brand: [params.selectedBrandData.id],
          category: [selectedCat.id, params.selectedSubcat.id]
        };
        console.log('sub cate', subcatData);
        console.log('params subcat', params.selectedSubcat);
        console.log('prod id', prodId);
        console.log('obj', obj);
        await UserModel.getInstance().updateProduct(
          prodId,
          obj,
          succ => {
            setParams({ ...params, openSuccess: true });
            console.log(succ);
            console.log('props save', props);

            setTimeout(() => {
              props.history.push('/products');
            }, 1000);
          },
          err => {
            console.log(err);
          }
        );
        console.log(obj);
      }
    }
  };

  const catChangeHandle = async (event, val) => {
    var arr = event.target.id.split('-')[2];
    console.log('cat val', val);
    if (val) {
      setParams({ ...params, selectedCat: { id: val.id, name: val.name } });
      setSelectedCat({
        id: val.id,
        name: val.name
      });
      UserModel.getInstance().getSubCategory(
        val.id,
        async data => {
          await setParams({ ...params, selectedSubcat: {} });
          setSelectedSubcat({});
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

  const deleteImage = async () => {
    setImages(null);
    setImagesFile(null);
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

  const subcatHandleChange = async (event, val) => {
    var arr = event.target.id.split('-')[2];
    console.log('sub cat val', val);
    if (val) {
      // selectedSubcat = subcatData[arr];
      // setSelectedSubcat(selectedSubcat);
      setParams({ ...params, selectedSubcat: { id: val.id, name: val.name } });
      setSelectedSubcat({
        id: val.id,
        name: val.name
      });
    }
  };

  const brandHandleChange = async (event, val) => {
    var arr = event.target.getAttribute('data-option-index');
    console.log('brnd val', val);
    if (val) {
      setParams({
        ...params,
        selectedBrandData: { id: val.id, name: val.name }
      });
      // const brandId =
      //   brandData[event.target.getAttribute('data-option-index')].id;
      // console.log(brandId);
      // setParams({
      //   ...params,
      //   selectedBrandData:
      //     brandData[event.target.getAttribute('data-option-index')]
      // });
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

  const checkForBlanks = () => {
    console.log('selectedBrandData', selectedBrandData);
    if (
      params.name === '' ||
      selectedCat.id === '' ||
      params.selectedSubcat.id === '' ||
      params.selectedSubcat.id === undefined ||
      params.selectedBrandData === 0
    ) {
      return true;
    }
  };

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Edit Prod" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Specify prod name"
                  label="Prod name"
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
                  onChange={brandHandleChange}
                  onInputChange={brandSearch}
                  value={params.selectedBrandData}
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
                  value={selectedCat}
                  // onSelect= {(event, value) => {setParams({...params, selectedCat:value})}}
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
                  value={params.selectedSubcat}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Subcategory"
                      variant="outlined"
                    />
                  )}
                  onChange={subcatHandleChange}
                  loading
                  loadingText={
                    params.dataFetchStatus ? 'Loading' : 'No Matches'
                  }
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
            </Grid>
            <Snackbar
              open={params.openSuccess}
              autoHideDuration={6000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Product successfully updated
              </Alert>
            </Snackbar>
            <Snackbar
              open={params.openError}
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

export default EditProd;
