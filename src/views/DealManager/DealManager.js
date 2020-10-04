import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  MuiThemeProvider,
  createMuiTheme,
  TablePagination
} from '@material-ui/core';
import MaterialTable from 'material-table';
import UserModel from 'models/UserModel';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

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
  }
}));

const DealManager = props => {
  var [data, setData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'Deal Name', field: 'name', editable: 'never' },
    { title: 'Deal Id', field: 'id', editable: 'never' },
    { title: 'Start Time', field: 'start_time', editable: 'never' },
    { title: 'End Time', field: 'end_time', editable: 'never' }
  ]);

  const [params, setParams] = useState({
    page: 1,
    offset: 0
  });

  useEffect(() => {
    UserModel.getInstance().getDeal(
      null,
      succ => {
        console.log(succ);
        setData(succ);
      },
      err => {
        console.log(err);
      }
    );
    //     for (let index = 0; index < 60; index++) {
    //       latArr.push({ lat: index, lng: long });
    //       long++;
    //     }
    //     console.log(latArr);
    //     var distanceMat = [];
    //     for (let i = 0; i < latArr.length; i++) {
    //       var tempArray = [];
    //       for (let j = 0; j < latArr.length; j++) {
    //         var distance = Math.sqrt(
    //           ((latArr[i] - latArr[i]) ^ 2) + ((lngArr[i] - lngArr[i]) ^ 2)
    //         );
    //         tempArray.push(distance);
    //         console.log('processing');
    //       }
    //       distanceMatrix[i] = [tempArray];
    //     }
    //     console.log(distanceMatrix);
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
      const paramObj = { offset: newOffset };
      const newPage = params.page - 1;
      UserModel.getInstance().getDeal(
        paramObj,
        succ => {
          console.log(succ);
          setData(succ);
          setParams({ ...params, offset: newOffset, page: newPage });
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  const handleNextPage = async () => {
    const newOffset = params.offset + 20;
    const paramObj = { offset: newOffset };
    const newPage = params.page + 1;
    UserModel.getInstance().getDeal(
      paramObj,
      succ => {
        console.log(succ);
        setData(succ);
        setParams({ ...params, offset: newOffset, page: newPage });
      },
      err => {
        console.log(err);
      }
    );
  };

  const rowClickHandle = async (event, rowData) => {
    history.push(`deal-manager/deal-details/${rowData.id}`);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        title="Deals"
        columns={state}
        data={data}
        className={clsx(classes.root, className)}
        onRowClick={rowClickHandle}
        options={{
          paging: false,
          filtering: true
        }}
        actions={[
          // {
          //   icon: 'edit',
          //   tooltip: 'Edit Deal',
          //   onClick: (event, data) => {
          //     console.log('ddata', data);
          //     history.push(
          //       `/deals-manager/edit-deal/${data.orderId}`,
          //       (data = data)
          //     ); // Retailer info fetch info not ready so only passing switch status
          //   }
          // },
          {
            icon: 'add',
            tooltip: 'Add Deal',
            isFreeAction: true,
            onClick: (event, data) => {
              console.log('ddata', data);
              history.push(`/deal-manager/add-deal`, (data = data));
            }
          }
        ]}
        editable={{
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(async () => {
                resolve();
                console.log(oldData.skuId);
                await UserModel.getInstance().removeDeal(
                  oldData.id,
                  succ => {
                    console.log(succ);
                    window.location.reload();
                  },
                  err => {
                    console.log(err);
                  }
                );
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

export default DealManager;
