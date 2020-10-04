import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme, TablePagination } from '@material-ui/core';
import MaterialTable from 'material-table';
import UserModel from 'models/UserModel';
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


const SkuRequestsData = props => {
  const [params, setParams] = useState({
    page: 1,
    offset: 0,
  })

  var [searchText, setSearchText] = useState('');

  let history = useHistory();
  const { className, ...rest } = props;

  // const [data] = useState(mockData);
  const classes = useStyles();
  const [skuRequestsData, setSkuRequestsData] = useState([]);
  const [csvData, setCsvData] = useState([]);

  const [state, setState] = React.useState({
    columns: [
      { title: 'City', field: 'city', editable: 'never', filtering: true },
      { title: 'Request message', field: 'text', editable: 'never', filtering: true },
      { title: 'Mobile No.', field: 'mobile', editable: 'never', filtering: true },
      { title: 'Date / Time', field: 'time', editable: 'never', filtering: true },
    ]
  });

  const theme = createMuiTheme({
    typography: {
      fontFamily: 'Nunito Sans, Roboto, sans-serif'
    }
  });

  useEffect(() => {
    UserModel.getInstance().getSkuRequests(
      null,
      async data => {
        let tempArr = [];
        // console.log(data);
        await data.forEach(obj => {
          // console.log('Sku request', obj)
          tempArr.push({
            text: obj.text,
            city: obj.city,
            mobile: obj.mobile,
            time: obj.time,
          });
        });
        setSkuRequestsData(tempArr);
      },
      err => {
        console.log(err);
      }
    );
  }, []);

  const handleNextPage = () => {
    console.log(params)
    const newOffset = params.offset + 20;
    const paramObj = { offset: newOffset }
    const newPage = params.page + 1;
    if (searchText == '') {
      UserModel.getInstance().getSkuRequests(
        paramObj,
        async data => {
          console.log(data);
          let tempArr = [];

          await data.forEach(obj => {
            tempArr.push({
              text: obj.text,
              city: obj.city,
              mobile: obj.mobile,
              time: obj.time,
            });
          });
          // console.log(skuRequestsData)
          setSkuRequestsData(tempArr);
          setParams({ ...params, offset: newOffset, page: newPage })
        },
        err => {
          console.log(err);
        }
      );
    }
    // else {
    //   UserModel.getInstance().globalSearchProductSku(
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
      //        text: obj.text,
      //        city: obj.city,
      //        mobile: obj.mobile,
      //        time: obj.time,
    //         });
    //       });
    //       // console.log(prodData)
    //       setSkuRequestsData(tempArr);
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
      if (searchText == '') {
        UserModel.getInstance().getSkuRequests(
          paramObj,
          async data => {
            console.log(data);
            let tempArr = [];

            await data.forEach(obj => {
              tempArr.push({
                text: obj.text,
                city: obj.city,
                mobile: obj.mobile,
                time: obj.time,
              });
            });
            // console.log(skuRequestsData)
            setSkuRequestsData(tempArr);
            setParams({ ...params, offset: newOffset, page: newPage })
          },
          err => {
            console.log(err);
          }
        );
      }
      // else {
      //   UserModel.getInstance().globalSearchProductSku(
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
        //        text: obj.text,
        //        city: obj.city,
        //        mobile: obj.mobile,
        //        time: obj.time,
      //         });
      //       });
      //       // console.log(prodData)
      //       setSkuRequestsData(tempArr);
      //       setParams({ ...params, offset: newOffset, page: newPage });

      //     },
      //     err => {
      //       console.log(err)
      //     }
      //   )
      // }
    }
  }


  // const filterChange = (data) => {
  //   console.log('data', data)
  //   if (params.page !== 1) {
  //     setParams({
  //       ...params,
  //       page: 1,
  //       offset: 0
  //     })
  //   }
  //   if (data.length > 0) {
  //     setSearchText(data[0].value)
  //     console.log('data 0', data[0])
  //     // UserModel.getInstance().globalSearchProductSku(
  //     //   [{
  //     //     column_name: 'product_sku.name',
  //     //     text: data[0].value
  //     //   }],
  //     //   null,
  //     //   async data => {
  //     //     console.log('data search', data);
  //     //     let tempArr = [];

  //     //     await data.forEach(obj => {
  //     //       tempArr.push({
  //     //       text: obj.text,
  //     //       city: obj.city,
  //     //       mobile: obj.mobile,
  //     //       time: obj.time,
  //     //       });
  //     //     });
  //     //     // console.log(prodData)
  //     //     setSkuRequestsData(tempArr);
  //     //   },
  //     //   err => {
  //     //     console.log('my err', err)
  //     //   }
  //     // )
  //   }
  //   else {
  //     UserModel.getInstance().getSkuRequests(
  //       null,
  //       async data => {
  //         let tempArr = [];
  //         await data.forEach(obj => {
  //           console.log('broadcastMessage', obj)
  //           tempArr.push({
  //             text: obj.text,
  //             city: obj.city,
  //             mobile: obj.mobile,
  //             time: obj.time,
  //           });
  //         });
  //         setSkuRequestsData(tempArr);
  //         console.log(data);
  //       },
  //       err => {
  //         console.log(err);
  //       }
  //     );
  //   }
  // }

  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        title="SKU Requests"
        columns={state.columns}
        data={skuRequestsData}
        options={{
          paging: false,
          // filtering: true,
          search: false,
          exportButton: true,
          exportCsv: () => {
            parseAsync(csvData).then(csvData => {
              const blob = new Blob([csvData], {
                type: 'text/csv;charset=utf-8;'
              });
              const blobUrl = URL.createObjectURL(blob);
              console.log('blob', blobUrl);
              window.open(blobUrl);
            });
          }
        }}

        // onFilterChange={filterChange}
        className={clsx(classes.root, className)}

      // actions={[
      //   {
      //     icon: 'add',
      //     tooltip: 'Add Broadcast Message',
      //     isFreeAction: true,
      //     onClick: () => {
      //       history.push('/add-broadcast-message');
      //     }
      //   },
      //   {
      //     icon: 'edit',
      //     tooltip: 'Edit Broadcast Message',
      //     onClick: (event, data) => {
      //       //   history.push({
      //       //     pathname: '/edit-broadcast-message',
      //       //     state: { BroadcastMessageId: data.BroadcastMessageId, supp: data.supplier }
      //       //   });
      //       // }
      //       history.push(`/edit-broadcast-message/${data.BroadcastMessageId}`);
      //     }
      //   }
      // ]}
      // editable={{
      //   onRowDelete: oldData =>
      //     new Promise(resolve => {
      //       setTimeout(async () => {
      //         resolve();
      //         console.log(oldData.id);
      //         const id = oldData.id;
      //         await UserModel.getInstance().removeBroadcastMessage(
      //           id,
      //           succ => {
      //             console.log(succ);
      //             window.location.reload();
      //           },
      //           err => {
      //             console.log(err);
      //           }
      //         );
      //       }, 600);
      //     })
      // }}
      />
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

SkuRequestsData.propTypes = {
  className: PropTypes.string
};

export default SkuRequestsData;
