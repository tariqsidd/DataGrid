import React, { useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Switch from '@material-ui/core/Switch';
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
  CardActionArea,
  CardMedia
} from '@material-ui/core';
import { isObject } from 'validate.js';

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
  { id: 6, name: 'Cancelled' }
];
const EditManualOrder = props => {
  var [orderData, setorderData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'No', field: 'number', editable: 'never' },
    { title: 'Category', field: 'category', editable: 'never' },
    { title: 'Sub Category', field: 'subCategory', editable: 'never' },
    { title: 'Brands', field: 'brand', editable: 'never' },
    { title: 'Product', field: 'product', editable: 'never' },
    { title: 'Sku name', field: 'skuName', editable: 'never' },
    { title: 'Sku Code', field: 'skuCode', editable: 'never' },
    { title: 'Supplier', field: 'supplier', editable: 'never' },
    { title: 'Cost Price', field: 'costPrice', editable: 'never' },
    { title: 'Discount', field: 'discount', editable: 'never' },
    { title: 'Quantity', field: 'quantity' }
  ]);
  var [orderId, setOrderId] = useState();
  var [selectedOrderStatus, setSelectedOrderStatus] = useState();
  const [params, setParams] = useState({
    id: '',
    name: '',
    orderDate: '',
    amount: '',
    status: {},
    openSuccess: false,
    openError: false
  });

  const title = `Order Id : ${props.match.params.id}`;
  const theme = createMuiTheme({
    typography: {
      fontFamily: 'Nunito Sans, Roboto, sans-serif'
    }
  });
  useEffect(() => {
    // const id = props.match.params.id;
    // console.log('props id is.....: ', props.match.params);
    // console.log('props', props.location.state);
    UserModel.getInstance().getOrderDetail(
      props.match.params.id,
      async data => {
        // console.log("ssssssssssstatus", data)
        let tempArr = [];
        setParams({
          ...params,
          id: data.id,
          name: data.retailer_name,
          orderDate: new Date(data.created_at).toLocaleDateString(),
          amount: data.total,
          status: { id: data.status, name: order_status[data.status].name }
        })

        await data.items.forEach((obj, index) => {
          tempArr.push({
            number: index + 1,
            skuId: obj.sku_id,
            category: obj.categories[0].name,
            subCategory: obj.sub_categories[0] ? obj.sub_categories[0].name : '',
            brand: obj.brand ? obj.brand : "",
            product: obj.product_name,
            skuName: obj.sku_name,
            skuCode: obj.sku_code,
            supplier: obj.supplier ? obj.supplier : '',
            discount: obj.discount,
            costPrice: obj.price,
            quantity: obj.qty
          });
        });
        //       // console.log(retailerData)
        setorderData(tempArr);

      },
      err => {
        console.log('detail err', err);
      }
    );
    return () => {
      setOrderId(null);
      setSelectedOrderStatus(null);
      setParams(null);
    };
  }, []);
  let history = useHistory();

  const classes = useStyles();
  const { className, ...rest } = props;

  const orderStatusChange = async (event, val) => {
    // console.log('value', val);
    // console.log(event.target.dataset.optionIndex, order_status[event.target.dataset.optionIndex])
    // await setParams({...params, status: order_status[event.target.dataset.optionIndex]})
    await setParams({ ...params, status: { id: val.id, name: val.name } });
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

  const handleAmount = event => {
    setParams({
      ...params,
      [event.target.name]: event.target.value
    });
  };
  const handleDate = event => {
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
            props.history.push('/orders');

            // console.log('props', props);
          }, 3000);
        },
        err => {
          console.log(err);
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
                <Autocomplete
                  id="Order Status"
                  options={order_status}
                  getOptionLabel={option => option.name}
                  style={{ width: 300 }}
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
                  Error when making changes. Ensure all fields are filled
                </Alert>
              </Snackbar>
            </Grid>
            <br />
          </CardContent>
          <CardActions>
            <Button color="primary" variant="contained" onClick={handleSubmit}>
              Make changes
            </Button>
          </CardActions>
          <Divider/>
        </form>
        <br/>

        <MuiThemeProvider theme={theme}>
          <MaterialTable
            title="Order Details"
            columns={state}
            options={{
              filtering: true,
              paging: false
            }}
            actions={[
              {
                icon: 'add',
                tooltip: 'Add order Item',
                isFreeAction: true,
                onClick: () => {
                  history.push(`/orders/add-order-detail/${props.match.params.id}`);
                }
              },
            ]}
            data={orderData}
            className={clsx(classes.root, className)}
            editable={{
              onRowDelete: oldData =>
                new Promise(resolve => {
                  setTimeout(async () => {
                    resolve();
                    // console.log('skuId', oldData.skuId);
                    await UserModel.getInstance().removeOrderDetail(
                      {
                        order_id: params.id,
                        sku_id: oldData.skuId,
                        type: 'delete',
                      },
                      succ => {
                        // console.log(succ);
                        window.location.reload();
                      },
                      err => {
                        console.log(err);
                      }
                    );
                  }, 600);
                }),

              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  // setTimeout(() => {
                  //     const dataUpdate = [...data];
                  //     const index = oldData.tableData.id;
                  //     dataUpdate[index] = newData;
                  //     setData([...dataUpdate]);

                  resolve();
                  // console.log('old data', oldData)
                  // console.log('new data', newData)
                  var obj = {
                    order_id: params.id,
                    sku_id: newData.skuId,
                    qty: newData.quantity,
                    price: newData.price,
                    discount: newData.discount,
                    type: "update",
                  };
                  UserModel.getInstance().addOrderDetail(
                    obj,
                    succ => {
                      // console.log('succ', succ)
                      window.location.reload();
                    },
                    err => {
                      console.log('err', err)
                    }
                  )
                  // }, 1000);
                }),
            }}

          >
          </MaterialTable>
        </MuiThemeProvider>
      </Card>
    </div>
  );
};

export default EditManualOrder;
