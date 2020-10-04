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
    }
  }));
  
  const statusColors = {
    delivered: 'success',
    pending: 'info',
    refunded: 'danger'
  };


  const OrderDetail = props => {
    var [orderData, setorderData] = useState([]);
    const [state, setState] = React.useState([
      { title: 'Sku name', field: 'skuName', editable: 'never' },
      { title: 'Product', field: 'product', editable: 'never' },
      { title: 'Category', field: 'category', editable: 'never' },
      { title: 'Sub Category', field: 'subCategory', editable: 'never' },
      { title: 'Qunatity', field: 'quantity', editable: 'never' }
    ]);
  
    useEffect(() => {
        console.log('props',props.match.params.id)
        let tempArr = [{skuName: 'avvdc', product:'Pepsi', category:'beverages',subCategory:'soap',quantity:2}];
        setorderData(tempArr)
    //   UserModel.getInstance().getRetailersList(
    //     null,
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
     }, []);
  
    const { className, ...rest } = props;
    let history = useHistory();
  
    const classes = useStyles();
    const title=`Order Id : ${props.match.params.id}`
    const theme = createMuiTheme({
      typography: {
        fontFamily: 'Nunito Sans, Roboto, sans-serif'
      }
    });
  
    return (
      <MuiThemeProvider theme={theme}>
        <MaterialTable
          title={title}
          columns={state}
          
          data={orderData}
          className={clsx(classes.root, className)}
         >
          </MaterialTable>
      </MuiThemeProvider>
    );
  };
  
  OrderDetail.propTypes = {
    className: PropTypes.string
  };
  
  export default OrderDetail;
  







