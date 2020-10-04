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
//Supplier ID, Name, Store Name, Location, Address, Mobile Number, Password and Email
const SupplierData = props => {
  var [supplierData, setSupplierData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'Supplier ID', field: 'supplierId', editable: 'never' },
    { title: 'Supplier Name', field: 'name', editable: 'never' },
    { title: 'Store Name', field: 'storeName', editable: 'never' },
    { title: 'Location', field: 'location', editable: 'never' },
    { title: 'Addresss', field: 'address', editable: 'never' },
    { title: 'Mobile', field: 'mobile', editable: 'never' },
    { title: 'Email', field: 'email', editable: 'never' }
  ]);
  const [params, setParams] = useState({
    page: 1,
    offset: 0
  });

  useEffect(() => {
    UserModel.getInstance().getSupplier(
      null,
      async data => {
        console.log('supplier data', data);
        let tempArr = [];

        await data.forEach(obj => {
          tempArr.push({
            supplierId: obj.id,
            name: obj.name,
            email: obj.email,
            address: obj.address,
            mobile: obj.mobile,
            status: obj.is_verify,
            storeName: obj.detail.store_name,
            location: obj.detail.latlng
              ? obj.detail.latlng[0] + ',' + obj.detail.latlng[1]
              : ''
          });
          console.log(obj.detail.latlng);
        });
        setSupplierData(tempArr);
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

  const handleNextPage = async () => {
    const newOffset = params.offset + 20;
    const paramObj = { offset: newOffset };
    const newPage = params.page + 1;
    // UserModel.getInstance().getRetailersList(
    //   paramObj,
    //   async data => {
    //     console.log(data);
    //     let tempArr = [];

    //     await data.forEach(obj => {
    //       tempArr.push({
    //         retailerId: obj.id,
    //         name: obj.name,
    //         email: obj.email,
    //         mobile: obj.mobile,
    //         status: obj.is_verify
    //       });
    //     });
    //     // console.log(retailerData)
    //     setretailerData(tempArr);
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  };

  const handlePreviousPage = async () => {
    if (params.offset > 0) {
      const newOffset = params.offset - 20;
      const paramObj = { offset: newOffset };
      const newPage = params.page - 1;
      //   UserModel.getInstance().getRetailersList(
      //     paramObj,
      //     async data => {
      //       console.log(data);
      //       let tempArr = [];

      //       await data.forEach(obj => {
      //         tempArr.push({
      //           retailerId: obj.id,
      //           name: obj.name,
      //           email: obj.email,
      //           mobile: obj.mobile,
      //           status: obj.is_verify
      //         });
      //       });
      //       // console.log(retailerData)
      //       setretailerData(tempArr);
      //     },
      //     err => {
      //       console.log(err);
      //     }
      //   );
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        title="Suppiers"
        columns={state}
        data={supplierData}
        className={clsx(classes.root, className)}
        options={{
          paging: false
        }}
        actions={
          [
            // {
            //   icon: 'add',
            //   tooltip: 'Add Supplier',
            //   isFreeAction: true,
            //   onClick: () => {
            //     history.push('/supplier/add-supplier');
            //   }
            // },
            // {
            //   icon: 'edit',
            //   tooltip: 'Edit Supplier',
            //   onClick: (event, data) => {
            //     history.push(`/supplier/edit-supplier/${data.supplierId}`); // Retailer info fetch info not ready so only passing switch status
            //   }
            // }
          ]
        }
        editable={{
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                console.log(oldData);
                // UserModel.getInstance().removeProduct(
                //   oldData.retailerId,
                //   resData => {
                //     console.log(resData);
                //     window.location.reload();
                //   },
                //   err => {
                //     console.log(err);
                //   }
                // );
                // setretailerData((prevState) => {
                //   retailerData.splice(retailerData.indexOf(oldData), 1);
                //   return [...prevState, retailerData];
                // });
              }, 600);
            })
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

SupplierData.propTypes = {
  className: PropTypes.string
};

export default SupplierData;
