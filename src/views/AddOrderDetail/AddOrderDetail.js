import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';
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
  return <MuiAlert elevation={6} variant="fi
  lled" {...props} />;
}

const AddOrderDetail = props => {

  const classes = useStyles();
  const { className, ...rest } = props;
  var [skuData, setSkuData] = useState([]);
  var [selectedSku, setSelectedSku] = useState({});
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });
  // const [stock, setStock] = useState(false);
  // var [searchedProd, setSearchedProd] = useState('');
  const [fileList, setFileList] = useState([]);

  const [params, setParams] = useState({
    name: '',
    quantity:'',
    supplier:'',
    orderId:'',
    dataFetchStatus: true,
    submitStatus: false,
    price:'',
    discount:'',
  });

  let history = useHistory();

  useEffect(() => { 
  console.log('add',props.match.params.id)
  setParams({
    ...params,
    orderId:props.match.params.id
  })
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

  // const handleStock = (event) => {
  //   console.log('check',event.target.checked)
  //   setStock(event.target.checked);

  // };

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

  const SkuHandleChange = async (event, val) => {
    console.log('..................sku handle')
    var arr = event.target.id.split('-')[2];
    
    console.log('sku arr', val);

    const xx = skuData[arr];
    console.log('val',val)
    if(val){
      setSelectedSku({ id: val.id, name: val.name });
      setParams({
        ...params,
        supplier: val.supplier[0].name,
        price: val.price,
        discount: val.discount
      })
    }
    else{
      setSelectedSku({});
      setParams({
        ...params,
        supplier: '',
        price: '',
        discount:''
      })
    }
  
    console.log('selected sku', selectedSku);
  };

  const skuSearch = async (event, value) => {
    // setSelectedSku({});
    await setParams({ ...params, dataFetchStatus: false });
    await UserModel.getInstance().globalSearchProductSku(
     [{
        text:value,
        column_name:'product_sku.name'
     }] ,
     null,
      succ => {
        console.log('search succ',succ);
        // let tempArray = [];
        //   succ.forEach(obj => {
        //     if (obj.name !== null) {
        //       tempArray.push({ name: obj.name, id: obj.id });
        //     }
        //   });
        setSkuData(succ);
        setParams({ ...params, dataFetchStatus: true });
      },
      err => {
        console.log(err);
      }
    );
  };

  const checkErrors = () => {
    // console.log('bloody product status', selectedProd);
    if (
      selectedSku.name === undefined ||
      params.supplier === '' ||
      params.quantity === ''
  
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
        var obj = {
          order_id: params.orderId,
          sku_id:selectedSku.id,
          qty:params.quantity,
          price:params.price,
          discount:params.discount,
          type: "create",
        };
        UserModel.getInstance().addOrderDetail(
          obj,
          succ=>{
            console.log('succ',succ)
            setOpenData({ ...openData, openSuccess: true });
            setTimeout(() => {
              props.history.push(`/orders/edit-order/${params.orderId}`);
            }, 1000);
          },
          err=>{
            setParams({ ...params, submitStatus: false });
            console.log('err',err)
          }
        )
        
      }
    }
  };

  
  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader title="Add SKU" />
          <Divider />

          <CardContent>
            <Grid container spacing={3}>
              

              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="skuSelect"
                  options={skuData}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField {...params} label="Sku" variant="outlined" margin="dense" />
                  )} 
                  onChange={SkuHandleChange}
                  onInputChange={skuSearch}
                  loading
                  loadingText={
                    params.dataFetchStatus ? 'loading' : 'No Matches'
                  }
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  disabled
                  helperText="Supplier"
                  label="Supplier"
                  margin="dense"
                  name="supplier"
                  type="text"
                  //onChange={handleChange}
                  required
                  value={params.supplier}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Quantity"
                  label="Quantity"
                  margin="dense"
                  name="quantity"
                  type="number"
                  inputProps={{ min: 0 }}
                  min={0}
                  onChange={handleChange}
                  required
                  value={params.quantity}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Snackbar
              open={openData.openSuccess}
              autoHideDuration={6000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Order Item successfully added
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
             onClick={params.submitStatus ? null : handleSubmit}
            >
              Add Item
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default AddOrderDetail;
