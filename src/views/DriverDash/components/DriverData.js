import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
// import moment from 'moment';
// import PerfectScrollbar from 'react-perfect-scrollbar';
// import mockData from './data';
// import { StatusBullet } from 'components';
// import createPalette from '@material-ui/core/styles/createPalette';
// import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useHistory } from 'react-router-dom';
import PropTypes, { func } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { MuiThemeProvider, createMuiTheme,  TablePagination, } from '@material-ui/core';
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

const cities = ['','karachi','lahore'];

const DriverData = props => {
  var [driverData, setdriverData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'No', field: 'number', editable: 'never' },
    { title: 'Driver Id', field: 'id', editable: 'never' },
    { title: 'Driver Name', field: 'name', editable: 'never' },
    { title: 'Mobile', field: 'mobile', editable: 'never' },
    { title: 'City', field: 'city', editable: 'never' },
    { title: 'CNIC', field: 'cnic', editable: 'never' },
    { title: 'Vehicle', field: 'vehicle', editable: 'never' },
    { title: 'Address', field: 'address', editable: 'never' },
    ]);

    const [params, setParams] = useState({
      page: 1,
      offset: 0,
    })
    
  useEffect(() => {
      
    UserModel.getInstance().getDriver(
      null,
      async data => {
        console.log(data);
        let tempArr = [];

        data && data.length > 0 && Array.isArray(data) && await data.forEach((obj,index) => {
          tempArr.push({
            number: index+1,
            id: obj.id,
            name: obj.name,
            address:obj.address,
            mobile: obj.mobile?obj.mobile:'',
            cnic:obj.detail?obj.detail.cnic:'',
            vehicle:obj.detail?obj.detail.vehicle_name:'',
            city: obj.detail?cities[obj.detail.city_id]:''
          });
        });
        setdriverData(tempArr);
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

  
  const handleNextPage = () => {
    console.log(params)
    const newOffset = params.offset + 20;
    const paramObj = { offset: newOffset }
    const newPage = params.page + 1;
      UserModel.getInstance().getDriver(
        paramObj,
        async data => {
          console.log(data);
          let tempArr = [];

          await data.forEach((obj,index) => {
            tempArr.push({
              number: index+1,
            id: obj.id,
            name: obj.name,
            address:obj.address,
            mobile: obj.mobile?obj.mobile:'',
            cnic:obj.detail?obj.detail.cnic:'',
            vehicle:obj.detail?obj.detail.vehicle_name:'',
            });
          });
          // console.log(skuData)
          setdriverData(tempArr);
          setParams({ ...params, offset: newOffset, page: newPage })
        },
        err => {
          console.log(err);
        }
      );
    
    // else {
    //   UserModel.getInstance().searchSubCategory(
    //     [{
    //       text: searchText,
    //       column_name: 'product_sku.name'
    //     }],
    //     paramObj,
    //     async data => {
    //       console.log('data search', data);
    //       let tempArr = [];

    //       await data.forEach(obj => {
    //         tempArr.push({
    //           'subcategories.id': obj.id,
    //            'subcategories.cat_name': obj.cat_name,
    //           'subcategories.name': obj.name,
    //           'subcategories.code': obj.code,
    //         });
    //       });
    //       // console.log(prodData)
    //       setSubCategoryData(tempArr);
    //       setParams({ ...params, offset: newOffset, page: newPage });

    //     },
    //     err => {
    //       console.log(err)
    //     }
    //   )
    // }
  }

  const handlePreviousPage = () => {
    if (params.offset > 0) {
      const newOffset = params.offset - 20;
      const newPage = params.page - 1;
      const paramObj = { offset: newOffset }
      
        UserModel.getInstance().getDriver(
          paramObj,
          async data => {
            console.log(data);
            let tempArr = [];

            await data.forEach((obj,index) => {
              tempArr.push({
                number: index+1,
            id: obj.id,
            name: obj.name,
            address:obj.address,
            mobile: obj.mobile?obj.mobile:'',
            cnic:obj.detail?obj.detail.cnic:'',
            vehicle:obj.detail?obj.detail.vehicle_name:'',
              });
            });
            // console.log(skuData)
            setdriverData(tempArr);
            setParams({ ...params, offset: newOffset, page: newPage })
          },
          err => {
            console.log(err);
          }
        );
    
      // else {
      //   UserModel.getInstance().searchSubCategory(
      //     [{
      //       text: searchText,
      //       column_name: 'product_sku.name'
      //     }],
      //     paramObj,
      //     async data => {
      //       console.log('data search', data);
      //       let tempArr = [];

      //       await data.forEach(obj => {
      //         tempArr.push({
      //           'subcategories.id': obj.id,
      //           'subcategories.cat_name': obj.cat_name,
      //           'subcategories.name': obj.name,
      //           'subcategories.code': obj.code,
      //         });
      //       });
      //       // console.log(prodData)
      //       setSubCategoryData(tempArr);
      //       setParams({ ...params, offset: newOffset, page: newPage });

      //     },
      //     err => {
      //       console.log(err)
      //     }
      //   )
      // }
    }
  }

  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        title="Drivers Info "
        columns={state}
        data={driverData}
        className={clsx(classes.root, className)}
        options={{
          paging: false,
          // exportButton: true,
          // exportAllData: true,
          // filtering:true,
          // search:false
        }}
        actions={[
          {
            icon: 'add',
            tooltip: 'Add Driver',
            isFreeAction: true,
            onClick: () => {
              history.push('/drivers/add-driver');
            }
          },
          {
            icon: 'edit',
            tooltip: 'Edit Driver',
            onClick: (event, data) => {
                console.log('data',data)
              // history.push({
              //   pathname: '/edit-retailer',
              //   state: { id: data.retailerId, switch: data.status }
              // });
              history.push(`/drivers/edit-driver/${data.id}`); // Retailer info fetch info not ready so only passing switch status
            }
          }
        ]}
        editable={{
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                console.log(oldData);
           
                UserModel.getInstance().removeDriver(
                  oldData.id,
                  resData => {
                    console.log(resData);
                    window.location.reload();
                  },
                  err => {
                    console.log(err);
                  }
                );
                // setretailerData((prevState) => {
                //   retailerData.splice(retailerData.indexOf(oldData), 1);
                //   return [...prevState, retailerData];
                // });
              }, 600);
            })
        }}></MaterialTable>
          <TablePagination
        component="div"
        rowsPerPage={5}
        count={-1}
        rowsPerPageOptions={[5]}
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
          return `Page ${params.page}`
        }}
      />
    </MuiThemeProvider>
  );
};

DriverData.propTypes = {
  className: PropTypes.string
};

export default DriverData;
