import React, { useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from '../../models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MaterialTable from 'material-table';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  Paper
} from '@material-ui/core';
import FileUploader from '../../helpers/FileUploader';
import { Row } from 'antd';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddRoute = props => {
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });
  const [supplierData, setSupplierData] = useState([]);
  const [retailerData, setRetailerData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [routingData, setRoutingData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);

  const [state, setState] = React.useState([
    { title: 'Stop', field: 'stop', editable: 'never' },
    { title: 'Id', field: 'id', editable: 'never' },
    { title: 'Lat', field: 'lat', editable: 'never' },
    { title: 'Long', field: 'long', editable: 'never' },
    { title: 'Type', field: 'type', editable: 'never' },
    { title: 'Position', field: 'position' }
  ]);

  const [params, setParams] = useState({
    selectedDriver: null,
    selectedSupplier: {},
    selectedRetailer: {},
    selectedCity: {},
    suppLat: '',
    suppLong: '',
    retLat: '',
    retLong: '',
    routeName: '',
    todayDate: '',
    position: 0,
    fileUploaderVisible: false,
    buttonDisabled: true
  });
  const [routeData, setRouteData] = useState([]);
  const [cityOptions, setCityOptions] = useState([
    { name: 'Karachi', id: 1 },
    { name: 'Lahore', id: 2 }
  ]);
  const cityMapping = { 1: 'Karachi', 2: 'Lahore' };

  useEffect(() => {
    console.log('************** props params', props.match.params.route);
    // UserModel.getInstance().getDriver(
    //   null,
    //   succ => {
    //     setDriverData(succ);
    //     console.log(succ);
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
    getOrderData();
  }, []);

  const classes = useStyles();
  const { className, ...rest } = props;

  const handleChange = async (event, value) => {
    await setParams({
      ...params,
      [event.target.name]: event.target.value
    });
    console.log(params.routeName);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenData({ openSuccess: false, openError: false });
  };

  const driverSearch = async (event, value) => {
    // await setParams({ ...params, dataFetchStatus: false });

    if (value) {
      await UserModel.getInstance().searchDriver(
        { 'users.name': value },
        succ => {
          console.log(succ);
          let tempArr = [];
          succ.forEach(driver => {
            
            tempArr.push({
              id: driver.id,
              name: driver.name,
              city_id: driver.detail ? driver.detail.city_id : ''
            });
          });
          setDriverOptions(tempArr);
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  const driverHandleChange = async (event, value) => {
    await setRoutingData([]);
    console.log(value);
    if (value) {
      const driverName = value.name;
      console.log(value.id);
      setParams({
        ...params,
        selectedDriver: { id: value.id, name: value.name },
        selectedCity: {
          id: value.city_id,
          name: cityMapping[`${value.city_id}`]
        },
        buttonDisabled: true
      });
    }
  };

  const getOrderData = async => {
    var today = new Date();
    const td =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate() +
      ' 15:00:00';

    setParams({
      ...params,
      todayDate:
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate()
    });

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const ys =
      yesterday.getFullYear() +
      '-' +
      (yesterday.getMonth() + 1) +
      '-' +
      yesterday.getDate() +
      ' 23:00:00';

    UserModel.getInstance().downloadOrderDetails(
      { from: '2020-08-29 00:00:00', to: '2020-08-30 23:59:59' },
      async succ => {
        setOrderData(succ);
      },
      err => {
        console.log(err);
      }
    );
  };

  const createRoute = async () => {
    let stopArray = [];
    //Get supplier order details first
    await routingData.forEach(async userStop => {
      var itemArray = [];
      await orderData.forEach(succObj => {
        if (orderData.supplier_id !== '') {
          if (userStop.id === succObj.supplier_id) {
            if (succObj.order_status === '2') {
              itemArray.push({
                order_id: succObj.order_id,
                sku_id: succObj.sku_id
              });
            }
          }
        }
      });
      if (itemArray.length !== 0) {
        console.log('supplier item array', itemArray);
        stopArray.push({
          user_id: userStop.id,
          items: itemArray
        });
      }
    });
    console.log('supplier end');

    //Get retailer order details second
    await routingData.forEach(async userStop => {
      var itemArray = [];
      await orderData.forEach(succObj => {
        if (orderData.retailer_id !== '') {
          if (userStop.id === succObj.retailer_id) {
            if (succObj.order_status === '2') {
              console.log('retailer match');
              itemArray.push({
                order_id: succObj.order_id,
                sku_id: succObj.sku_id
              });
            }
          }
        }
      });
      if (itemArray.length !== 0) {
        console.log('retailer item array', itemArray);
        stopArray.push({
          user_id: userStop.id,
          items: itemArray
        });
      }
    });

    var finalArr = {
      user_id: params.selectedDriver.id,
      route_date: params.todayDate,
      name: params.routeName,
      stops: stopArray
    };
    // console.log(finalArr);

    UserModel.getInstance().addRoute(
      finalArr,
      succ => {
        console.log(succ);
        alert('Route added succcessfully');
        window.location.reload();
      },
      err => {
        alert('An error occurred. Please remove users having null lat long');
        console.log(err);
      }
    );
  };

  // const cityHandleChange = (event, value) => {
  //   console.log(value);
  //   setParams({ ...params, selectedCity: value });
  // };

  return (
    <div className={classes.root}>
      {params.selectedDriver ? (
        <FileUploader
          getData={async data => {
            let order = data;
            let tempArray = [];
            let singleObj = {};

            await setOrderData(data);
            // console.log('Order Data', order);
            //Set Supplier data
            let suppArr = [];
            let retArr = [];
            await order.forEach(orderRow => {
              let suppFound = false;
              for (let index = 0; index < suppArr.length; index++) {
                if (orderRow.supplier_id === suppArr[index]) {
                  suppFound = true;
                  // console.log(orderRow.supplier_id, suppArr[index]);
                }
              }
              if (!suppFound) {
                if (
                  orderRow.order_status === '2' &&
                  orderRow.city === params.selectedCity.name &&
                  orderRow.price !== '0'
                ) {
                  tempArray.push({
                    stop: orderRow.supplier_name,
                    id: orderRow.supplier_id,
                    lat: orderRow.suppLat,
                    long: orderRow.suppLng,
                    type: 'Supplier'
                  });
                  suppArr.push(orderRow.supplier_id);
                }
              }
            });
            //Set Retailer data
            await order.forEach(orderRow => {
              let retFound = false;
              for (let index = 0; index < retArr.length; index++) {
                if (orderRow.retailer_id === retArr[index]) {
                  retFound = true;
                  console.log('ret found');
                }
              }
              if (!retFound) {
                if (
                  orderRow.order_status === '2' &&
                  orderRow.city === params.selectedCity.name &&
                  orderRow.price !== '0'
                ) {
                  tempArray.push({
                    stop: orderRow.store_name,
                    id: orderRow.retailer_id,
                    lat: orderRow.lat,
                    long: orderRow.lng,
                    type: 'Retailer'
                  });
                  retArr.push(orderRow.retailer_id);
                }
              }
            });
            setParams({ ...params, buttonDisabled: false });
            setRoutingData(tempArray);
          }}
        />
      ) : null}

      {/* <Grid item spacing={3} direction="column" md={4}>
        <Autocomplete
          id="citySelect"
          variant="outlined"
          options={cityOptions}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField {...params} label="City" variant="outlined" />
          )}
          value={params.selectedCity}
          onChange={cityHandleChange}
        />
      </Grid> */}
      <br />
      <Grid container spacing={3} direction="row">
        <Grid item spacing={3} direction="column" md={5}>
          <Grid item spacing={3}>
            <TextField disabled value={params.selectedCity.name} />
          </Grid>
          <br />
          <Grid item spacing={3}>
            <TextField
              fullWidth
              label="Route name"
              name="routeName"
              onChange={handleChange}
              required
              value={params.routeName}
              variant="outlined"
            />
          </Grid>
          <br />
          <Grid item spacing={3}>
            <Paper>
              <form autoComplete="off" noValidate>
                <CardHeader title="Driver Selection" />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={8} xs={12}>
                      <Autocomplete
                        id="Driver"
                        options={driverOptions}
                        getOptionLabel={option => option.name}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label="Driver"
                            variant="outlined"
                          />
                        )}
                        onChange={driverHandleChange}
                        onInputChange={driverSearch}
                        value={params.selectedDriver}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
              </form>
            </Paper>
          </Grid>
          <br />
          <Grid item spacing={3}>
            <Button
              color="primary"
              variant="contained"
              onClick={createRoute}
              disabled={params.buttonDisabled}>
              Create Route
            </Button>
          </Grid>
        </Grid>

        <Grid item spacing={3} direction="row" md={7}>
          <Grid item>
            <MaterialTable
              title="Route"
              columns={state}
              data={routingData}
              className={clsx(classes.root, className)}
              options={{
                paging: false,
                // filtering: true,
                search: false
              }}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      // console.log(newData);
                      routingData.forEach(row => {
                        if (row.stop === newData.stop) {
                          row.position = newData.position;
                        }
                      });
                      setRoutingData(routingData);
                      resolve();
                    }, 1000);
                  })
              }}
              actions={[
                {
                  icon: 'delete',
                  tooltip: 'Delete Route',
                  onClick: (event, data) => {
                    console.log('ddata', data);
                    var deletedPos = 0;
                    const newRoutingData = routingData.filter(obj => {
                      if (obj.stop === data.stop) {
                        deletedPos = obj.position;
                      }
                      return obj.stop !== data.stop;
                    });
                    newRoutingData.forEach(stop => {
                      if (stop.position > deletedPos) {
                        stop.position = stop.position - 1;
                      }
                    });
                    setRoutingData(newRoutingData);
                    // history.push(`/routes/edit-route/${data.route}`, data = data); // Retailer info fetch info not ready so only passing switch status
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
    </div>
  );
};

export default AddRoute;
