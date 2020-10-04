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

// import mockData from './data';
// import { StatusBullet } from 'components';
// import createPalette from '@material-ui/core/styles/createPalette';

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

const SubcatData = props => {
  const { className, ...rest } = props;

  const [params, setParams] = useState({
    page: 1,
    offset: 0,
  })

  var [searchText, setSearchText] = useState('');


  // const classes = useStyles();

  const [subCategoryData, setSubCategoryData] = useState([]);
  const [state, setState] = React.useState({
    columns: [
      // { title: 'Subcategory Id', field: 'subcategories.id' },
      { title: 'Category Name', field: 'subcategories.cat_name' },
      { title: 'Subcategory Name', field: 'subcategories.name' },
      { title: 'Subcategory code', field: 'subcategories.code' },
      // { title: 'Image', field: 'subcategories.image' },
      // { title: 'Is Active', field: 'subcategories.is_active' },
    ],
  })

  const theme = createMuiTheme({
    typography: {
      fontFamily: "Nunito Sans, Roboto, sans-serif"
    }
  });


  useEffect(() => {
    UserModel.getInstance().getSubCategory(
      null,
      async data => {
        let tempArr = [];
        await data.forEach(obj => {
          // console.log('obj',obj)
          tempArr.push({
            'subcategories.id': obj.id,
            'subcategories.cat_name': obj.cat_name,
            'subcategories.name': obj.name,
            'subcategories.code': obj.code,
          });
        });
        setSubCategoryData(tempArr);
        console.log(data);
      },
      err => {
        console.log(err);
      }
    );
  }, []);

  console.log({ subCategoryData })

  let history = useHistory();
  // const { className, ...rest } = props;

  const classes = useStyles();

  const handleNextPage = () => {
    console.log(params)
    const newOffset = params.offset + 20;
    const paramObj = { offset: newOffset }
    const newPage = params.page + 1;
      UserModel.getInstance().getSubCategory(
        paramObj,
        async data => {
          console.log(data);
          let tempArr = [];

          await data.forEach(obj => {
            tempArr.push({
              'subcategories.id': obj.id,
              'subcategories.cat_name': obj.cat_name,
              'subcategories.name': obj.name,
              'subcategories.code': obj.code,
            });
          });
          // console.log(skuData)
          setSubCategoryData(tempArr);
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
      
        UserModel.getInstance().getSubCategory(
          paramObj,
          async data => {
            console.log(data);
            let tempArr = [];

            await data.forEach(obj => {
              tempArr.push({
                'subcategories.id': obj.id,
                'subcategories.cat_name': obj.cat_name,
                'subcategories.name': obj.name,
                'subcategories.code': obj.code,
              });
            });
            // console.log(skuData)
            setSubCategoryData(tempArr);
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
      // UserModel.getInstance().searchSubCategory(
      //   searchColumnsData,
      //   null,
      //   async data => {
      //     console.log('data search', data);
      //     let tempArr = [];

      //     await data.forEach(obj => {
      //       tempArr.push({
      //         'subcategories.id': obj.id,
      //         'subcategories.name': obj.name,
      //         'subcategories.code': obj.code,
      //       });
      //     });
      //     // console.log(prodData)
      //     setSubCategoryData(tempArr);

      //   },
      //   err => {
      //     console.log('my err', err)
      //   }
      // )
    }
    else {
      UserModel.getInstance().getSubCategory(
        null,
        async data => {
          let tempArr = [];
          await data.forEach(obj => {
            // console.log('sku',obj)
            tempArr.push({
              'subcategories.id': obj.id,
              'subcategories.cat_name': obj.cat_name,
              'subcategories.name': obj.name,
              'subcategories.code': obj.code,
            });
          });
          setSubCategoryData(tempArr);
          console.log(data);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  return (
    <MuiThemeProvider theme={theme} >
      <MaterialTable
        title="Subcategories"
        columns={state.columns}
        data={subCategoryData}

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
            tooltip: 'Add Subcategory',
            isFreeAction: true,
            onClick: () => {
              history.push('/add-subcategory');
            }
          },
          {
            icon: 'edit',
            tooltip: 'Edit Subcategory',
            onClick: (event, data) => {
              console.log({ event, data })
              //   history.push({
              //     pathname: '/edit-subcategory',
              //     state: { skuId: data.skuId, supp: data.supplier }
              //   });
              // }
              history.push(`/edit-subcategory/${data['subcategories.id']}`);
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

SubcatData.propTypes = {
  className: PropTypes.string
};

export default SubcatData;
