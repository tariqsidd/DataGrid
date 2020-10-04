import React, { useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
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

const DealDetails = props => {
  var [dealData, setDealData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'Sku Name', field: 'sku_name', editable: 'never' },
    { title: 'Deal Name', field: 'name', editable: 'never' },
    { title: 'Price', field: 'price', editable: 'never' },
    { title: 'Discount', field: 'discount', editable: 'never' }
  ]);
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
    console.log('props id is.....: ', props.match.params);
    console.log('props', props.location.state);
    UserModel.getInstance().getDealDetail(
      props.match.params.id,
      null,
      async data => {
        let tempArr = [];
        console.log('sku name [0]', data[0].sku_name);
        data.forEach(sku => {
          tempArr.push({
            id: data[0].id,
            name: data[0].name,
            discount: data[0].discount,
            price: data[0].price,
            sku_name: data[0].sku_name
          });
        });
        setParams({
          ...params,
          id: data[0].id
        });

        setDealData(tempArr);
      },
      err => {
        console.log('detail err', err);
      }
    );
  }, []);

  const classes = useStyles();
  const { className, ...rest } = props;

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
    console.log('params', params.status);
    if (errors) {
      setParams({ ...params, openError: true });
      alert('Fill all required fields');
    } else {
      var obj = {
        status: params.status.id
      };
      console.log(obj);
      UserModel.getInstance().updateOrderStatus(
        props.match.params.id,
        obj,
        succ => {
          console.log(succ);
          setParams({ ...params, openSuccess: true });
          setTimeout(() => {
            props.history.push('/orders');

            console.log('props', props);
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
          <CardHeader subheader={'Deal Id : ' + props.match.params.id} />

          <Divider />
          <CardContent>
            <Grid container spacing={3}>
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
          <Divider />
          {/* <CardActions>
            <Button color="primary" variant="contained" onClick={handleSubmit}>
              Make changes
            </Button>
          </CardActions> */}
        </form>

        <MuiThemeProvider theme={theme}>
          <MaterialTable
            title="Deal Details"
            columns={state}
            options={{
              filtering: true
            }}
            data={dealData}
            className={clsx(classes.root, className)}></MaterialTable>
        </MuiThemeProvider>
      </Card>
    </div>
  );
};

export default DealDetails;
