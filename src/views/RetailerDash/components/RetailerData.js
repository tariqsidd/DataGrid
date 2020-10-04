import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
// import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useHistory } from 'react-router-dom';
import PropTypes, { func } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  MuiThemeProvider,
  createMuiTheme,
  TablePagination
} from '@material-ui/core';
import MaterialTable from 'material-table';

import UserModel from 'models/UserModel';

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

const statusColors = {
  delivered: 'success',
  pending: 'info',
  refunded: 'danger'
};

const RetailerData = props => {
  var [retailerData, setretailerData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'Retailer Id', field: 'id', editable: 'never', filtering: true },
    {
      title: 'Retailer Name',
      field: 'name',
      editable: 'never',
      filtering: true
    },
    { title: 'Email', field: 'email', editable: 'never', filtering: true },
    {
      title: 'Mobile',
      field: 'mobile',
      editable: 'never',
      filterPlaceholder: 'eg: 33XXXXXXXX'
    },
    { title: 'Lat Lng', field: 'latlng', editable: 'never', filtering: false },
    { title: 'Status', field: 'status', editable: 'never', filtering: false }
  ]);
  const [params, setParams] = useState({
    page: 1,
    offset: 0
  });

  useEffect(() => {
    UserModel.getInstance().getRetailersList(
      null,
      async data => {
        console.log(data);
        let tempArr = [];

        await data.forEach(obj => {
          tempArr.push({
            id: obj.id,
            name: obj.name,
            email: obj.email,
            mobile: obj.mobile,
            status: obj.is_verify,
            latlng: `${obj.detail.latlng.lat},${obj.detail.latlng.lng}`
          });
        });
        // console.log(retailerData)
        setretailerData(tempArr);
      },
      err => {
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

  const handleNextPage = async data => {
    const newOffset = params.offset + 20;
    const paramObj = { offset: newOffset };
    const newPage = params.page + 1;
    UserModel.getInstance().getRetailersList(
      paramObj,
      async data => {
        console.log(data);
        let tempArr = [];

        await data.forEach(obj => {
          tempArr.push({
            id: obj.id,
            name: obj.name,
            email: obj.email,
            mobile: obj.mobile,
            status: obj.is_verify,
            latlng: `${obj.detail.latlng.lat},${obj.detail.latlng.lng}`
          });
        });
        setretailerData(tempArr);
        setParams({ ...params, offset: newOffset, page: newPage });
      },
      err => {
        console.log(err);
      }
    );
  };

  const handlePreviousPage = async () => {
    if (params.offset > 0) {
      const newOffset = params.offset - 20;
      const paramObj = { offset: newOffset };
      const newPage = params.page - 1;
      UserModel.getInstance().getRetailersList(
        paramObj,
        async data => {
          console.log(data);
          let tempArr = [];

          await data.forEach(obj => {
            tempArr.push({
              id: obj.id,
              name: obj.name,
              email: obj.email,
              mobile: obj.mobile,
              status: obj.is_verify,
              latlng: `${obj.detail.latlng.lat},${obj.detail.latlng.lng}`
            });
          });
          // console.log(retailerData)
          setretailerData(tempArr);
          setParams({ ...params, offset: newOffset, page: newPage });
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  const handleRowClick = (event, data) => {
    history.push(`/retailer/${data.id}`);
  };

  const filterChange = data => {
    console.log('data', data);
    if (params.page !== 1) {
      setParams({
        ...params,
        page: 1,
        offset: 0
      });
    }

    if (data.length > 0) {
      let searchArray = [];
      data.map((x, i) => {
        console.log('map data value', x.value);
        searchArray.push({
          column_name: x.column.field,
          text: x.value
        });
      });
      // console.log('search Array',searchArray)
      console.log('............................................searxh');
      UserModel.getInstance().globalSearchRetailer(
        searchArray,
        null,
        async data => {
          console.log('data search', data);
          let tempArr = [];

          await data.forEach(obj => {
            tempArr.push({
              id: obj.id,
              name: obj.name,
              email: obj.email,
              mobile: obj.mobile,
              status: obj.is_verify,
              latlng: `${obj.detail.latlng.lat},${obj.detail.latlng.lng}`
            });
          });
          // console.log(retailerData)
          setretailerData(tempArr);
        },
        err => {
          console.log('my err', err);
        }
      );
    }
    else {
      UserModel.getInstance().getRetailersList(
        null,
        async data => {
          console.log(data);
          let tempArr = [];
          await data.forEach(obj => {
            tempArr.push({
              id: obj.id,
              name: obj.name,
              email: obj.email,
              mobile: obj.mobile,
              status: obj.is_verify,
              latlng: `${obj.detail.latlng.lat},${obj.detail.latlng.lng}`
            });
          });
          // console.log(retailerData)
          setretailerData(tempArr);
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        title="Retailers"
        columns={state}
        data={retailerData}
        className={clsx(classes.root, className)}
        options={{
          paging: false,
          filtering: true
        }}
        onFilterChange={filterChange}
        onRowClick={handleRowClick}
        actions={
          [
            // {
            //   icon: 'add',
            //   tooltip: 'Add Retailer',
            //   isFreeAction: true,
            //   onClick: () => {
            //     history.push('/add-retailer');
            //   }
            // }
            // {
            //   icon: 'edit',
            //   tooltip: 'Edit Retailer',
            //   onClick: (event, data) => {
            //     console.log('edidt data',data);
            //   //  history.push(`/edit-retailer/${data.status}`); // Retailer info fetch info not ready so only passing switch status
            //   }
            // }
          ]
        }
        // editable={{
        //   onRowDelete: oldData =>
        //     new Promise(resolve => {
        //       setTimeout(() => {
        //         resolve();
        //         console.log(oldData);
        //         UserModel.getInstance().removeRetailer(
        //           oldData.id,
        //           resData => {
        //             console.log(resData);
        //             window.location.reload();
        //           },
        //           err => {
        //             console.log(err);
        //           }
        //         );
        // setretailerData((prevState) => {
        //   retailerData.splice(retailerData.indexOf(oldData), 1);
        //   return [...prevState, retailerData];
        // });
        //       }, 600);
        //     })
        // }}
      ></MaterialTable>
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

RetailerData.propTypes = {
  className: PropTypes.string
};

export default RetailerData;
