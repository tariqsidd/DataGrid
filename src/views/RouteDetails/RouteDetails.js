import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import PropTypes, { func } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import MaterialTable from 'material-table';
import { Grid, Button } from '@material-ui/core';
import UserModel from '../../models/UserModel';

const useStyles = makeStyles(theme => ({
  root: {},
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
  },
  custom: {
    fontFamily: 'Roboto',
    margin: 20
  }
}));

const statusColors = {
  delivered: 'success',
  pending: 'info',
  refunded: 'danger'
};

const RouteDetail = props => {
  console.log('props', props.match.params.route);
  var [routeData, setRouteData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'Stop Id', field: 'stopId', editable: 'never' },
    { title: 'User Id', field: 'userId', editable: 'never' },
    { title: 'Delivered', field: 'delivered', editable: 'never' }
    // { title: 'Retailer', field: 'retailer', editable: 'never' }
  ]);
  var [params, setParams] = useState({
    id: '',
    mobile: ''
  });

  useEffect(() => {
    UserModel.getInstance().getRouteDetails(
      null,
      props.match.params.route,
      succ => {
        console.log('consoleeee', succ);
        var tempArray = [];
        var index = 0;
        succ[0].stops.forEach(obj => {
          tempArray.push({
            stopId: obj.id,
            userId: obj.user_id,
            delivered: obj.is_complete
            // retailer: obj.stops[`${index}`].user.name
          });
          index++;
        });
        console.log(tempArray);
        setRouteData(tempArray);
        setParams({
          ...params,
          id: succ.routes[0].id,
          mobile: succ.routes[0].mobile,
          name: succ.routes[0].name
        });
      },
      err => {
        console.log(err);
      }
    );
  }, []);

  const { className, ...rest } = props;

  const classes = useStyles();
  const theme = createMuiTheme({
    typography: {
      fontFamily: 'Nunito Sans, Roboto, sans-serif'
    }
  });

  return (
    <MuiThemeProvider theme={theme}>
      <Button className={clsx(classes.custom, className)}>
        Driver: {params.id}
      </Button>
      <Button className={clsx(classes.custom, className)}>
        Contact: {params.mobile}
      </Button>
      <MaterialTable
        title={params.name}
        columns={state}
        data={routeData}
        className={clsx(classes.root, className)}></MaterialTable>
    </MuiThemeProvider>
  );
};

RouteDetail.propTypes = {
  className: PropTypes.string
};

export default RouteDetail;
