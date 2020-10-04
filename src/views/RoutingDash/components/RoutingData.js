import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import PropTypes, { func } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  MuiThemeProvider,
  createMuiTheme,
  TablePagination,
  CircularProgress
} from '@material-ui/core';
import MaterialTable from 'material-table';
import UserModel from '../../../models/UserModel';

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
  }
}));

const order_status = [
  'Paending',
  'In Preparation',
  'Ready to Ship',
  'In Transit',
  'Deliverd',
  'closed',
  'cancelled'
];

const RoutingData = props => {
  var [RoutingData, setRoutingData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'Route Name', field: 'route', editable: 'never' },
    { title: 'Route Id', field: 'id', editable: 'never' },
    { title: 'Drive Contact', field: 'driverPhone', editable: 'never' },
    { title: 'Last modified', field: 'timestamp', editable: 'never' }
  ]);
  const [isLoader, setIsLoader] = useState(false);

  const [params, setParams] = useState({
    page: 1,
    offset: 0
  });

  useEffect(() => {
    setIsLoader(true);
    UserModel.getInstance().getRoute(
      null,
      async data => {
        console.log('daat', data.routes);
        let tempArr = [];

        await data.routes.forEach(obj => {
          tempArr.push({
            id: obj.id,
            route: obj.name,
            timestamp: obj.route_date,
            driverPhone: obj.mobile
          });
          // console.log(obj.detail.latlng);
        });
        setIsLoader(false);
        setRoutingData(tempArr);
      },
      err => {
        setIsLoader(false);
        console.log(err);
      }
    );
  }, []);

  const { className, ...rest } = props;
  let history = useHistory();

  const classes = useStyles();

  const theme = createMuiTheme({
    typography: {
      fontFamily: 'Nunito Sans, Roboto, sans-serif'
    }
  });

  const handleNextPage = async () => {
    const newOffset = params.offset + 20;
    const paramObj = { offset: newOffset };
    const newPage = params.page + 1;
    console.log(params, params);
    setIsLoader(true);

    UserModel.getInstance().getRoute(
      paramObj,
      async data => {
        console.log('daat', data.routes);
        let tempArr = [];

        await data.routes.forEach(obj => {
          tempArr.push({
            id: obj.id,
            route: obj.name,
            timestamp: obj.route_date,
            driverPhone: obj.mobile
          });
          // console.log(obj.detail.latlng);
        });
        setParams({ ...params, offset: newOffset, page: newPage });
        setIsLoader(false);
        setRoutingData(tempArr);
      },
      err => {
        console.log('fail');
        setIsLoader(false);
        console.log(err);
      }
    );
  };

  const handlePreviousPage = async () => {
    if (params.offset > 0) {
      setIsLoader(true);
      const newOffset = params.offset - 20;
      const newPage = params.page - 1;
      const paramObj = { offset: newOffset };

      UserModel.getInstance().getRoute(
        paramObj,
        async data => {
          console.log('daat', data.routes);
          let tempArr = [];

          await data.routes.forEach(obj => {
            tempArr.push({
              id: obj.id,
              route: obj.name,
              timestamp: obj.route_date,
              driverPhone: obj.mobile
            });
            // console.log(obj.detail.latlng);
          });
          setParams({ ...params, offset: newOffset, page: newPage });
          setIsLoader(false);

          setRoutingData(tempArr);
        },
        err => {
          setIsLoader(false);
          console.log(err);
        }
      );
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        title="Routes"
        columns={state}
        data={RoutingData}
        isLoading={isLoader}
        className={clsx(classes.root, className)}
        options={{
          paging: false,
          loadingType: 'overlay'
        }}
        editable={{
          onRowDelete: oldData => {
            // console.log({ oldData });
            new Promise(resolve => {
              // console.log({ resolve });
              setTimeout(async () => {
                resolve();
                await UserModel.getInstance().deleteRoute(
                  oldData.id,
                  succ => {
                    console.log(succ);
                    // window.location.reload();
                  },
                  err => {
                    console.log(err);
                  }
                );
              }, 100);
            });
          }
        }}
        actions={[
          {
            icon: 'add',
            tooltip: 'Add Route',
            isFreeAction: true,
            onClick: (event, data) => {
              history.push('/routes/add-route');
            }
          }
        ]}
        onRowClick={(event, rowData) => {
          console.log('row click', rowData);
          history.push(`/routes/${rowData.id}`);
        }}></MaterialTable>
      <TablePagination
        component="div"
        rowsPerPage={10}
        count={-1}
        rowsPerPageOptions={[10]}
        page={params.page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
          onClick: handlePreviousPage
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
          onClick: handleNextPage
        }}
        labelDisplayedRows={() => {
          return `Page ${params.page}`;
        }}
      />
    </MuiThemeProvider>
  );
};

RoutingData.propTypes = {
  className: PropTypes.string
};

export default RoutingData;
