import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel,
  MuiThemeProvider,
  TablePagination,
  createMuiTheme
} from '@material-ui/core';
import MaterialTable from 'material-table';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import UserModel from 'models/UserModel';

import mockData from './data';
import { StatusBullet } from 'components';
import createPalette from '@material-ui/core/styles/createPalette';

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

const BrandsData = props => {
  const { className, ...rest } = props;

  const [params, setParams] = useState({
    page: 1,
    offset: 0,
  })

  var [searchText, setSearchText] = useState('');


  // const classes = useStyles();

  const [brandData, setBrandData] = useState([]);
  const [state, setState] = React.useState({
    columns: [
      { title: 'Brand Id', field: 'brand.id' },
      { title: 'Brand Name', field: 'brand.name' },
      // { title: 'Brand code', field: 'brand.code' },
      // { title: 'Image', field: 'brand.image' },
      // { title: 'Is Active', field: 'brand.is_active' },
    ],
  })

  const theme = createMuiTheme({
    typography: {
      fontFamily: "Nunito Sans, Roboto, sans-serif"
    }
  });








  useEffect(() => {
    UserModel.getInstance().getBrand(
      null,
      async data => {
        let tempArr = [];
        await data.forEach(obj => {
          // console.log('obj',obj)
          tempArr.push({
            'brand.id': obj.id,
            'brand.name': obj.name,
            // 'brand.code': obj.code,
          });
        });
        setBrandData(tempArr);
        console.log(data);
      },
      err => {
        console.log(err);
      }
    );
  }, []);

  console.log({brandData})

  let history = useHistory();
  // const { className, ...rest } = props;

  const classes = useStyles();

  const handleNextPage = () => {
    console.log(params)
    const newOffset = params.offset + 20;
    const paramObj = { offset: newOffset }
    const newPage = params.page + 1;
    if (searchText == '') {
      UserModel.getInstance().getBrand(
        paramObj,
        async data => {
          console.log(data);
          let tempArr = [];

          await data.forEach(obj => {
            tempArr.push({
              'brand.id': obj.id,
              'brand.name': obj.name,
              // 'brand.code': obj.code,
            });
          });
          // console.log(skuData)
          setBrandData(tempArr);
          setParams({ ...params, offset: newOffset, page: newPage })
        },
        err => {
          console.log(err);
        }
      );
    }
    // else {
    //   UserModel.getInstance().searchBrand(
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
    //           'brand.id': obj.id,
    //           'brand.name': obj.name,
    //           'brand.code': obj.code,
    //         });
    //       });
    //       // console.log(prodData)
    //       setBrandData(tempArr);
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
        UserModel.getInstance().getBrand(
          paramObj,
          async data => {
            console.log(data);
            let tempArr = [];

            await data.forEach(obj => {
              tempArr.push({
                'brand.id': obj.id,
                'brand.name': obj.name,
                // 'brand.code': obj.code,
              });
            });
            // console.log(skuData)
            setBrandData(tempArr);
            setParams({ ...params, offset: newOffset, page: newPage })
          },
          err => {
            console.log(err);
          }
        );
      }
      // else {
      //   UserModel.getInstance().searchBrand(
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
      //           'brand.id': obj.id,
      //           'brand.name': obj.name,
      //           'brand.code': obj.code,
      //         });
      //       });
      //       // console.log(prodData)
      //       setBrandData(tempArr);
      //       setParams({ ...params, offset: newOffset, page: newPage });

      //     },
      //     err => {
      //       console.log(err)
      //     }
      //   )
      // }
    }
  }


  const filterChange = (data) => {
    console.log('data', data)
    if (params.page !== 1) {
      setParams({
        ...params,
        page: 1,
        offset: 0
      })
    }
    if (data.length > 0) {
      console.log(searchText)
      setSearchText(data[0].value)
      let searchColumnsData = [];
      data && data.length > 0 && Array.isArray(data) && data.map((item, idx) => {
        searchColumnsData.push({
          column_name: item.column.field,
          text: item.column.tableData.filterValue
        })
      })
      console.log({ searchColumnsData })
      // UserModel.getInstance().searchBrand(
      //   searchColumnsData,
      //   null,
      //   async data => {
      //     console.log('data search', data);
      //     let tempArr = [];

      //     await data.forEach(obj => {
      //       tempArr.push({
      //         'brand.id': obj.id,
      //         'brand.name': obj.name,
      //         'brand.code': obj.code,
      //       });
      //     });
      //     // console.log(prodData)
      //     setBrandData(tempArr);

      //   },
      //   err => {
      //     console.log('my err', err)
      //   }
      // )
    }
    else {
      UserModel.getInstance().getBrand(
        null,
        async data => {
          let tempArr = [];
          await data.forEach(obj => {
            // console.log('sku',obj)
            tempArr.push({
              'brand.id': obj.id,
              'brand.name': obj.name,
              // 'brand.code': obj.code,
            });
          });
          setBrandData(tempArr);
          console.log(data);
        },
        err => {
          console.log(err);
        }
      );
    }
  }









  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        title="Brands"
        columns={state.columns}
        data={brandData}

        options={{
          paging: false,
          exportButton: true,
          filtering: true,
        }}

        // onFilterChange={filterChange}
        className={clsx(classes.root, className)}
        actions={[
          {
            icon: 'add',
            tooltip: 'Add Brand',
            isFreeAction: true,
            onClick: () => {
              history.push('/add-brand');
            }
          },
          {
            icon: 'edit',
            tooltip: 'Edit Brand',
            onClick: (event, data) => {
              console.log({event, data})
              //   history.push({
              //     pathname: '/edit-brand',
              //     state: { skuId: data.skuId, supp: data.supplier }
              //   });
              // }
              history.push(`/edit-brand/${data['brand.id']}`);
            }
          }
        ]}
        
        // className={clsx(classes.root, className)}
        
        editable={{
          // onRowAdd: (newData) =>
          //   new Promise((resolve) => {
          //     setTimeout(() => {
          //       resolve();
          //       setState((prevState) => {
          //         const data = [...prevState.data];
          //         data.push(newData);
          //         return { ...prevState, data };
          //       });
          //     }, 600);
          //   }),
          // onRowUpdate: (newData, oldData) =>
          //   new Promise((resolve) => {
          //     setTimeout(() => {
          //       resolve();
          //       if (oldData) {
          //         setState((prevState) => {
          //           const data = [...prevState.data];
          //           data[data.indexOf(oldData)] = newData;
          //           return { ...prevState, data };
          //         });
          //       }
          //     }, 600);
          //   }),
          // onRowDelete: (oldData) =>
          //   new Promise((resolve) => {
          //     setTimeout(() => {
          //       resolve();
          //       setState((prevState) => {
          //         const data = [...prevState.data];
          //         data.splice(data.indexOf(oldData), 1);
          //         return { ...prevState, data };
          //       });
          //     }, 600);
          //   }),
        }}
      >
      </MaterialTable>
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

BrandsData.propTypes = {
  className: PropTypes.string
};

export default BrandsData;
