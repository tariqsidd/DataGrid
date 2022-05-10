import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import MaterialTable from 'material-table';

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    padding: 0
  },
  inner: {
    minWidth: 800
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const order_status = [
  { id: 0, name: 'Pending' },
  { id: 1, name: 'In Preparation' },
  { id: 2, name: 'Ready to Ship' },
  { id: 3, name: 'In Transit' },
  { id: 4, name: 'Delivered' },
  { id: 5, name: 'Closed' },
  { id: 6, name: 'Cancelled' },
  { id: 7, name: 'Returned' },
  { id: 8, name: 'Shop Closed' },
  { id: 9, name: 'On Hold' },
];
const EditManualOrder = props => {
  var [orderData, setorderData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'No.', field: 'number', filtering: false, width: '5%'  },
    { title: 'Sku Code', field: 'skuCode', filtering: false },
    { title: 'Sku Name', field: 'skuName',  },
    { title: 'Supplier', field: 'supplier',  },
    { title: 'Unit Cost Price', field: 'costPrice', filtering: false, width: '5%'  },
    { title: 'Discount per unit', field: 'discount',  filtering: false, width: '5%'},
    { title: 'Quantity', field: 'quantity', filtering: false, width: '5%'},
    { title: 'Brand', field: 'brand',  },
    { title: 'Category', field: 'category',  },
  ]);
  var [orderId, setOrderId] = useState();
  var [selectedOrderStatus, setSelectedOrderStatus] = useState();
  const [params, setParams] = useState({
    id: '',
    name: '',
    orderDate: '',
    deliveryDate: '',
    amount: '',
    status: {},
    openSuccess: false,
    openError: false,
    specialDiscount: ''
  });

  const theme = createMuiTheme({
    typography: {
      fontFamily: 'Nunito Sans, Roboto, sans-serif'
    }
  });
  useEffect(() => {
    getOrderInfo();
    return () => {
      setOrderId(null);
      setSelectedOrderStatus(null);
      setParams(null);
    };
    // eslint-disable-next-line
  }, []);

  const getOrderInfo = () => {
    UserModel.getInstance().getOrderDetail(
      props.match.params.id,
      async data => {
        let tempArr = [];
        setParams({
          ...params,
          id: data.id,
          name: data.retailer_name,
          orderDate: new Date(data.created_at).toLocaleDateString(),
          deliveryDate: new Date(data.delivered_at).toLocaleDateString(),
          amount: data.total,
          status: { id: data.status, name: order_status[data.status].name },
          specialDiscount: data.special_discount
        })

        await data.items.forEach((obj, index) => {
          tempArr.push({
            number: index + 1,
            skuId: obj.sku_id,
            category: (obj.categories && obj.categories[0]) ? obj.categories[0].categories_name : '',
            brand: obj.brand_name ? obj.brand_name : "",
            skuName: obj.name,
            skuCode: obj.sku_code,
            supplier: obj.supplier ? obj.supplier : '',
            discount: obj.discount,
            costPrice: obj.price,
            quantity: obj.qty
          });
        });
        setorderData(tempArr);

      },
      err => {
      }
    );
  }


  const classes = useStyles();
  const { className, ...rest } = props;

  const orderStatusChange = async (event, val) => {
    setParams({ ...params, status: { id: val.id, name: val.name } });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setParams({ ...params, openSuccess: false, openError: false });
  };

  const handleChange = event => {
    setParams({
      ...params,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = () => {
    const errors = checkForBlanks();
    // console.log('params', params.status);
    if (errors) {
      setParams({ ...params, openError: true });
      alert('Fill all required fields');
    } else {
      var obj = {
        status: params.status.id
      };
      // console.log(obj);
      UserModel.getInstance().updateOrderStatus(
        props.match.params.id,
        obj,
        succ => {
          // console.log(succ);
          setParams({ ...params, openSuccess: true });
          setTimeout(() => {
            props.history.push('/manual-orders');

            // console.log('props', props);
          }, 3000);
        },
        err => {
          // console.log(err);
          setParams({ ...params, openError: true });
        }
      );
    }
  };

  const checkForBlanks = () => {
    if (
      params.status === '' ||
      params.status === null ||
      params.status === undefined
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" noValidate>
          <CardHeader
            title="Change Order"
            subheader={'Order Id : ' + props.match.params.id}
          />

          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  disabled={true}
                  helperText="Order Number"
                  label="Order Number"
                  margin="dense"
                  name="id"
                  onChange={handleChange}
                  required
                  value={params.id}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  disabled={true}
                  helperText="Specify Retailer name"
                  label="Retailer name"
                  margin="dense"
                  name="name"
                  onChange={handleChange}
                  required
                  value={params.name}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  disabled={true}
                  fullWidth
                  helperText="Amount in Rs"
                  label="Total Order Amount"
                  margin="dense"
                  name="amount"
                  onChange={handleChange}
                  required
                  value={params.amount}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  disabled={true}
                  fullWidth
                  helperText="Special Discount!"
                  label="special discount"
                  margin="dense"
                  name="specialDiscount"
                  onChange={handleChange}
                  required
                  value={params.specialDiscount}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  disabled={true}
                  fullWidth
                  helperText="Order Date"
                  label="Date"
                  margin="dense"
                  name="orderDate"
                  onChange={handleChange}
                  required
                  value={params.orderDate}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  disabled={true}
                  fullWidth
                  helperText="Delivery Date"
                  label="Delivery Date"
                  margin="dense"
                  name="deliveryDate"
                  onChange={handleChange}
                  required
                  value={params.deliveryDate}
                  variant="outlined"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="Order Status"
                  options={order_status}
                  getOptionLabel={option => option.name}
                  // style={{ width: 300 }}
                  disabled
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Order Status"
                      margin="dense"
                      variant="outlined"
                    />
                  )}
                  onChange={orderStatusChange}
                  value={params.status}
                />
              </Grid>

              <Snackbar
                open={params.openSuccess}
                autoHideDuration={6000}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                  Order successfully updated
                </Alert>
              </Snackbar>
              <Snackbar
                open={params.openError}
                autoHideDuration={6000}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                  Error when making changes. Ensure fields are filled
                </Alert>
              </Snackbar>
            </Grid>
            <br />
          </CardContent>
          <CardActions>
            <Button color="primary" variant="contained" disabled onClick={handleSubmit}>
              Make changes
            </Button>
          </CardActions>
          <Divider />
        </form>
        <br />

        <MuiThemeProvider theme={theme}>
          <MaterialTable
            title="Order Details"
            columns={state}
            options={{
              filtering: true,
              paging: false,
              search: false
            }}
            data={orderData}
            className={clsx(classes.root, className)}
          >
          </MaterialTable>
        </MuiThemeProvider>
      </Card>
    </div>
  );
};

export default EditManualOrder;
