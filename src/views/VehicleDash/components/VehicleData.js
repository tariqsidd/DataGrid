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
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
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

const VehicleData = props => {
  var [vehicleData, setvehicleData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'No', field: 'number', editable: 'never' },
    { title: 'Vehicle Id', field: 'id', editable: 'never' },
    { title: 'Car Name', field: 'name', editable: 'never' },
    { title: 'Make', field: 'make', editable: 'never' },
    { title: 'Color', field: 'color', editable: 'never' },
    { title: 'Vehicle Number', field: 'vehicleNumber', editable: 'never' },
    ]);

  useEffect(() => {
 
      UserModel.getInstance().getVehicles(null,
        async data => {
          console.log('vehicle respones',data)
          let tempArr = [];

        await data.forEach((obj,index) => {
          tempArr.push({
            number: index+1,
            id: obj.id,
            name:obj.name,
            make: obj.car_make,
            color: obj.color,
            vehicleNumber: obj.registration_number,
          });
        });
        setvehicleData(tempArr)
        },
        err => {
          console.log(err)
        }
        )
    // UserModel.getInstance().getRetailersList(
    //   null,
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
  }, []);

  const { className, ...rest } = props;
  let history = useHistory();

  const classes = useStyles();

  const theme = createMuiTheme({
    typography: {
      fontFamily: 'Nunito Sans, Roboto, sans-serif'
    }
  });

  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        title="Registered Vehicles "
        columns={state}
        data={vehicleData}
        className={clsx(classes.root, className)}
        actions={[
          {
            icon: 'add',
            tooltip: 'Add Vehicle',
            isFreeAction: true,
            onClick: () => {
              history.push('/vehicles/add-vehicle');
            }
          },
          {
            icon: 'edit',
            tooltip: 'Edit Vehicle',
            onClick: (event, data) => {
                console.log('data',data)
              // history.push({
              //   pathname: '/edit-retailer',
              //   state: { id: data.retailerId, switch: data.status }
              // });
              history.push(`/vehicles/edit-vehicle/${data.id}`); // Retailer info fetch info not ready so only passing switch status
            }
          }
        ]}
        editable={{
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                console.log(oldData);
                UserModel.getInstance().removeVehicle(
                  oldData.id,
                  resData => {
                    console.log(resData);
                    window.location.reload();
                  },
                  err => {
                    console.log(err);
                  }
                );
                setvehicleData((prevState) => {
                  vehicleData.splice(vehicleData.indexOf(oldData), 1);
                  return [...prevState, vehicleData];
                });
              }, 600);
            })
        }}></MaterialTable>
    </MuiThemeProvider>
  );
};

VehicleData.propTypes = {
  className: PropTypes.string
};

export default VehicleData;
