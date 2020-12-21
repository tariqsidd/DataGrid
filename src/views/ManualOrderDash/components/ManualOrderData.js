import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import PropTypes, { func } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  MuiThemeProvider,
  createMuiTheme,
  TablePagination,
  Dialog
} from '@material-ui/core';
import MaterialTable from 'material-table';
import UserModel from '../../../models/UserModel';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { AsyncParser, parseAsync } from 'json2csv';

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

const order_status = [
  'Pending',
  'In Preparation',
  'Ready to Ship',
  'In Transit',
  'Delivered',
  'Closed',
  'Cancelled'
];

const ManualOrderData = props => {
  var [orderData, setorderData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'Order Number', field: 'order_number', editable: 'never' },
    {
      title: 'Order Date',
      field: 'created_at',
      editable: 'never',
      filtering: false
    },
    {
      title: 'Retailer',
      field: 'retailerName',
      editable: 'never',
      filtering: false
    },
    { title: 'Amount', field: 'amount', editable: 'never', filtering: false },
    // { title: 'Promo Discount', field: 'coupon_discount', editable: 'never', filtering: false },
    { title: 'Special Discount', field: 'special_discount', editable: 'never', filtering: false },
    // { title: 'Wallet Discount', field: 'wallet_discount', editable: 'never', filtering: false },
    { title: 'Total Bill', field: 'total_payable', editable: 'never', filtering: false },
    {
      title: 'Status',
      field: 'status',
      editable: 'never',
      lookup: {
        0: 'Pending',
        1: 'In Preparation',
        2: 'Ready to Ship',
        3: 'In Transit',
        4: 'Delivered',
        5: 'Closed',
        6: 'Cancelled'
      }
    }
  ]);
  const [params, setParams] = useState({
    page: 1,
    offset: 0,
    showCalendar: false
  });
  const [csvData, setCsvData] = useState([]);
  const [fromDat, setFromDat] = useState('');
  const [toDat, setToDat] = useState('');
  const [dateSelRange, setDateSelRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), -7),
      key: 'selection'
    }
  ]);
  var [searchText, setSearchText] = useState('');

  useEffect(() => {
    UserModel.getInstance().getOrderLog(
      null,
      data => {
        // console.log('order data', data);

        let tempArr = [];

        data.forEach(obj => {
          var bill = obj.total;
          console.log(bill)
          if (obj.special_discount) {
            bill = bill - obj.special_discount
          }
          console.log(bill)

          if (obj.coupon_discount) {
            bill = bill - obj.coupon_discount
          }
          console.log(bill)

          if (obj.wallet_discount && obj.wallet_discount.amount) {
            bill = bill - obj.wallet_discount.amount
          }
          console.log(bill)
          tempArr.push({
            orderId: obj.id,
            order_number: obj.order_number,
            retailerName: obj.retailer,
            amount: obj.total,
            coupon_discount: obj.coupon_discount ? obj.coupon_discount : 0,
            special_discount: obj.special_discount ? obj.special_discount : 0,
            wallet_discount: obj.wallet_discount ? obj.wallet_discount.amount : 0,
            total_payable: bill,
            created_at: new Date(obj.created_at).toLocaleDateString(),
            status: obj.status
          });
        });
        // console.log('ppppppppppppppppppppppppp');
        setorderData(tempArr);
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

  const handlePreviousPage = async () => {
    if (params.offset > 0) {
      const newOffset = params.offset - 20;
      const newPage = params.page - 1;
      const paramObj = { offset: newOffset };
      UserModel.getInstance().getOrderLog(
        paramObj,
        async data => {
          // console.log('order data', data);

          let tempArr = [];

          data.forEach(obj => {
            var bill = obj.total;
            if (obj.special_discount) {
              bill = bill - obj.special_discount
            }
            // console.log(bill)

            if (obj.coupon_discount) {
              bill = bill - obj.coupon_discount
            }
            // console.log(bill)

            if (obj.wallet_discount && obj.wallet_discount.amount) {
              bill = bill - obj.wallet_discount.amount
            }
            // console.log(bill)
            tempArr.push({
              orderId: obj.id,
              order_number: obj.order_number,
              retailerName: obj.retailer,
              amount: obj.total,
              coupon_discount: obj.coupon_discount ? obj.coupon_discount : 0,
              special_discount: obj.special_discount ? obj.special_discount : 0,
              wallet_discount: obj.wallet_discount ? obj.wallet_discount.amount : 0,
              total_payable: bill,
              created_at: new Date(obj.created_at).toLocaleDateString(),
              status: obj.status
            });
          });
          setorderData(tempArr);
          setParams({ ...params, offset: newOffset, page: newPage });
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  const handleNextPage = async () => {
    // console.log(params);
    const newOffset = params.offset + 20;
    const paramObj = { offset: newOffset };
    const newPage = params.page + 1;
    UserModel.getInstance().getOrderLog(
      paramObj,
      async data => {
        // console.log('order data', data);

        let tempArr = [];

        data.forEach(obj => {
          var bill = obj.total;
          if (obj.special_discount) {
            bill = bill - obj.special_discount
          }
          // console.log(bill)

          if (obj.coupon_discount) {
            bill = bill - obj.coupon_discount
          }
          // console.log(bill)

          if (obj.wallet_discount && obj.wallet_discount.amount) {
            bill = bill - obj.wallet_discount.amount
          }
          // console.log(bill)
          tempArr.push({
            orderId: obj.id,
            order_number: obj.order_number,
            retailerName: obj.retailer,
            amount: obj.total,
            coupon_discount: obj.coupon_discount ? obj.coupon_discount : 0,
            special_discount: obj.special_discount ? obj.special_discount : 0,
            wallet_discount: obj.wallet_discount ? obj.wallet_discount.amount : 0,
            total_payable: bill,
            created_at: new Date(obj.created_at).toLocaleDateString(),
            status: obj.status
          });
        });

        setorderData(tempArr);
        setParams({ ...params, offset: newOffset, page: newPage });
      },
      err => {
        console.log(err);
      }
    );
  };

  const handleDateChange = async item => {
    await setDateSelRange([item.selection]);
    const fromDate =
      item.selection.startDate.getFullYear() +
      '-' +
      (item.selection.startDate.getMonth() + 1) +
      '-' +
      item.selection.startDate.getDate();
    const toDate =
      item.selection.endDate.getFullYear() +
      '-' +
      (item.selection.endDate.getMonth() + 1) +
      '-' +
      item.selection.endDate.getDate();

    const par = { from: fromDate };

    UserModel.getInstance().downloadOrderDetails(
      { from: fromDate + ' 15:00:00', to: toDate + ' 23:59:59' },
      succ => {
        // console.log(succ);
        setCsvData(succ);
      },
      err => {
        console.log(err);
      }
    );
    setFromDat(fromDate);
    // console.log('from dat', fromDat);
    setToDat(toDate);
    // console.log('from', fromDate + ' 23:59:59');
    // console.log('to', toDate + ' 15:00:00');
    // console.log(item.selection.startDate + ' ' + fromDate);
    // console.log(item.selection.endDate);
  };

  const filterChange = async data => {
    // console.log('data', data);
    if (params.page !== 1) {
      setParams({
        ...params,
        page: 1,
        offset: 0
      });
    }
    if (data.length > 0 && data[0].value.length > 0) {
      let searchArray = [];
      data.map((x, i) => {
        // console.log('map data value', x.value);
        searchArray.push({
          column_name: x.column.field,
          text: x.column.field == 'status' ? x.value[0] : x.value
        });
      });
      // console.log('search Array', searchArray);
      // console.log('search Array llllennnnnnnghtt', searchArray[0].text.length);

      await UserModel.getInstance().globalSearchOrder(
        searchArray,
        null,
        async data => {
          // console.log('daata search ', data);
          let tempArr = [];

          await data.forEach(obj => {
            // console.log(obj);
            var bill = obj.total;
            if (obj.special_discount) {
              bill = bill - obj.special_discount
            }
            // console.log(bill)

            if (obj.coupon_discount) {
              bill = bill - obj.coupon_discount
            }
            // console.log(bill)

            if (obj.wallet_discount && obj.wallet_discount.amount) {
              bill = bill - obj.wallet_discount.amount
            }
            // console.log(bill)
            tempArr.push({
              orderId: obj.id,
              order_number: obj.order_number,
              retailerName: obj.retailer,
              amount: obj.total,
              coupon_discount: obj.coupon_discount ? obj.coupon_discount : 0,
              special_discount: obj.special_discount ? obj.special_discount : 0,
              wallet_discount: obj.wallet_discount ? obj.wallet_discount.amount : 0,
              total_payable: bill,
              created_at: new Date(obj.created_at).toLocaleDateString(),
              status: obj.status
            });
          });
          //  console.log(retaileata)

          await setorderData(tempArr);
        },
        err => {
          console.log('my err', err);
        }
      );
      // console.log('order data filter', orderData);
    } else {
      // console.log('else');
      UserModel.getInstance().getOrderLog(
        null,
        data => {
          // console.log('order data', data);

          let tempArr = [];

          data.forEach(obj => {
            var bill = obj.total;
            if (obj.special_discount) {
              bill = bill - obj.special_discount
            }
            // console.log(bill)

            if (obj.coupon_discount) {
              bill = bill - obj.coupon_discount
            }
            // console.log(bill)

            if (obj.wallet_discount && obj.wallet_discount.amount) {
              bill = bill - obj.wallet_discount.amount
            }
            // console.log(bill)
            tempArr.push({
              orderId: obj.id,
              order_number: obj.order_number,
              retailerName: obj.retailer,
              amount: obj.total,
              coupon_discount: obj.coupon_discount ? obj.coupon_discount : 0,
              special_discount: obj.special_discount ? obj.special_discount : 0,
              wallet_discount: obj.wallet_discount ? obj.wallet_discount.amount : 0,
              total_payable: bill,
              created_at: new Date(obj.created_at).toLocaleDateString(),
              status: obj.status
            });
          });
          // console.log('111111', tempArr);
          setorderData(tempArr);
          // console.log('222222', tempArr);
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      {params.showCalendar ? (
        <Dialog
          open={params.showCalendar}
          onClose={() => {
            setParams({ ...params, showCalendar: false });
          }}>
          <DateRangePicker
            onChange={handleDateChange}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={dateSelRange}
            direction="horizontal"
            startDate={dateSelRange.startDate}
            endDate={dateSelRange.endDate}
          />
        </Dialog>
      ) : null}
      <MaterialTable
        title="Orders"
        columns={state}
        data={orderData}
        className={clsx(classes.root, className)}
        onFilterChange={filterChange}
        options={{
          paging: false,
          exportButton: true,
          filtering: true,
          exportCsv: () => {
            parseAsync(csvData).then(csvData => {
              const blob = new Blob([csvData], {
                type: 'text/csv;charset=utf-8;'
              });
              const blobUrl = URL.createObjectURL(blob);
              // console.log('blob', blobUrl);
              window.open(blobUrl);
            });
          }
        }}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit Order',
            onClick: (event, data) => {
              // console.log('ddata', data);
              history.push(`/manual-order/edit-manual-order-detail/${data.orderId}`, (data = data)); // Retailer info fetch info not ready so only passing switch status
            }
          },
          {
            icon: CalendarTodayIcon,
            isFreeAction: true,
            onClick: (event, data) => {
              if (params.showCalendar) {
                setParams({ ...params, showCalendar: false });
              } else {
                setParams({ ...params, showCalendar: true });
              }
            }
          },
          {
            icon: 'add',
            tooltip: 'Add Manual Order',
            isFreeAction: true,
            onClick: () => {
              history.push('/add-manual-order');
            }
          },
        ]}></MaterialTable>
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

ManualOrderData.propTypes = {
  className: PropTypes.string
};

export default ManualOrderData;
