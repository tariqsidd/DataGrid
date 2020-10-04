import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import PropTypes, { func } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  MuiThemeProvider,
  createMuiTheme,
  colors,
  TablePagination,
  Dialog,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress
} from '@material-ui/core';
import MaterialTable from 'material-table';
import UserModel from 'models/UserModel';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

const useStyles = makeStyles(theme => ({
  root: {},

  dateCard: {
    paddingLeft: 20,
    width: 200,
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    height: 50
  },
  centerText: {
    //   alignSelf:'center',
    //   textAlign:'center',
    alignItems: 'center'
    // alignContent:'center',
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
  },
  buttPrev: {
    backgroundColor: colors.deepOrange[400],
    variant: 'outlined'
  }
}));

const SkuAggrData = props => {
  var [data, setData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'Sku', field: 'name', editable: 'never' },
    { title: 'Order Count', field: 'no_order', editable: 'never' },
    { title: 'Quantity', field: 'qty', editable: 'never' },
    { title: 'City', field: 'city', editable: 'never' },
    { title: 'Supplier', field: 'supplier', editable: 'never' }
  ]);
  const [params, setParams] = useState({
    showCalendar: false,
    page: 1
  });
  const [fromDat, setFromDat] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [toDat, setToDat] = useState('');
  const [dateSelRange, setDateSelRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), -7),
      key: 'selection'
    }
  ]);

  useEffect(() => {}, []);

  const { className, ...rest } = props;
  let history = useHistory();

  const classes = useStyles();

  const theme = createMuiTheme({
    typography: {
      fontFamily: 'Nunito Sans, Roboto, sans-serif'
    }
  });

  const handlePreviousPage = async () => {};

  const handleNextPage = async () => {};

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
    // UserModel.getInstance().getAggregateSku(
    //   { from: fromDate, to: toDate },
    //   data => {
    //     setData(data);
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
    // setIsLoader(true)

    UserModel.getInstance().getAllSkuData(
      { from: fromDate, to: toDate },
      succ => {
        console.log(succ);
        setData(succ);
        // setIsLoader(false)
      },
      err => {
        setData([]);
        // setIsLoader(false)
        console.log(err);
      }
    );
    setFromDat(fromDate);
    console.log('from dat', fromDat);
    setToDat(toDate);
    console.log(item.selection.startDate + ' ' + fromDate);
  };

  return isLoader ? (
    <div className={classes.loader}>
      <CircularProgress />
    </div>
  ) : (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Orders aggregated by SKU" />
      {fromDat ? (
        <Card {...rest} className={clsx(classes.cardRow, className)}>
          <Card {...rest} className={clsx(classes.dateCard, className)}>
            <span {...rest} className={clsx(classes.centerText, className)}>
              {' '}
              from : {new Date(fromDat).toLocaleDateString()}{' '}
            </span>
          </Card>
          <Card {...rest} className={clsx(classes.dateCard, className)}>
            <span {...rest} className={clsx(classes.centerText, className)}>
              {' '}
              to : {new Date(toDat).toLocaleDateString()}
            </span>
          </Card>
        </Card>
      ) : null}

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
          columns={state}
          title={''}
          data={data}
          className={clsx(classes.root, className)}
          options={{
            paging: false,
            exportButton: true,
            exportAllData: true

            // exportCsv: () => {
            //   const rows = [
            //     ['name1', 'city1', 'some other info'],
            //     ['name2', 'city2', 'more info']
            //   ];
            //   let csvContent = 'data:text/csv;charset=utf-8,';

            //   rows.forEach(function(rowArray) {
            //     let row = rowArray.join(',');
            //     csvContent += row + '\r\n';
            //   });
            //   var encodedUri = encodeURI(csvContent);
            //   window.open(encodedUri);
            // }
          }}
          actions={[
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
            }
          ]}></MaterialTable>

        <TablePagination
          component="div"
          rowsPerPage={5}
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
    </Card>
  );
};

SkuAggrData.propTypes = {
  className: PropTypes.string
};

export default SkuAggrData;
