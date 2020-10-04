import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import {
  MuiThemeProvider,
  createMuiTheme,
  TablePagination,
  TextField,
  MenuItem
} from '@material-ui/core';
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

const cities = [
  {
    value: 1,
    label: 'Karachi'
  },
  {
    value: 2,
    label: 'Lahore'
  }
];

const SkuData = props => {
  const [params, setParams] = useState({
    page: 1,
    offset: 0,
    cityId: 1
  });

  var [searchText, setSearchText] = useState('');

  useEffect(() => {
    UserModel.getInstance().getSku(
      null,
      async data => {
        let tempArr = [];
        await data.forEach(obj => {
          console.log('sku', obj);
          tempArr.push({
            skuId: obj.id,
            'product_sku.name': obj.name,
            'product_sku.code': obj.code ? obj.code : 0,
            'user.name': obj.supplier ? obj.supplier[0].name : '',
            cat: obj.product ? obj.product.categories[0].name : '',
            subcat: obj.product.subcategories.length
              ? obj.product.subcategories[0].name
              : '',
            'product_sku.price': obj.price,
            'product_sku.discount': obj.discount,
            'products.name': obj.product.name,
            'product_sku.is_stock': obj.is_stock
            // stock: obj.stock
          });
        });
        setSkuData(tempArr);
        console.log(data);
      },
      err => {
        console.log(err);
      }
    );

    handleSkuDownload();
  }, []);

  let history = useHistory();
  const { className, ...rest } = props;

  // const [data] = useState(mockData);
  const classes = useStyles();
  const [skuData, setSkuData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [state, setState] = React.useState({
    columns: [
      {
        title: 'Sku Code',
        field: 'product_sku.code',
        editable: 'never',
        filtering: false
      },
      {
        title: 'Sku Name',
        field: 'product_sku.name',
        filterPlaceholder: 'search'
      },
      { title: 'Product', field: 'products.name', filtering: true },
      { title: 'Category', field: 'cat', editable: 'never', filtering: false },
      {
        title: 'Subcategory',
        field: 'subcat',
        editable: 'never',
        filtering: false
      },
      {
        title: 'out of stock',
        field: 'product_sku.is_stock',
        filtering: false
      },
      { title: 'Price', field: 'product_sku.price', filtering: false },
      { title: 'Discount', field: 'product_sku.discount', filtering: false },
      { title: 'Supplier', field: 'user.name', filtering: true }
    ]
  });

  const theme = createMuiTheme({
    typography: {
      fontFamily: 'Nunito Sans, Roboto, sans-serif'
    }
  });

  const handleNextPage = () => {
    console.log(params);
    const newOffset = params.offset + 20;
    const paramObj = { offset: newOffset };
    const newPage = params.page + 1;
    if (searchText == '') {
      UserModel.getInstance().getSku(
        paramObj,
        async data => {
          console.log(data);
          let tempArr = [];

          await data.forEach(obj => {
            tempArr.push({
              skuId: obj.id,
              'product_sku.name': obj.name,
              'product_sku.code': obj.code ? obj.code : 0,
              'user.name': obj.supplier ? obj.supplier[0].name : '',
              cat: obj.product ? obj.product.categories[0].name : '',
              subcat: obj.product.subcategories.length
                ? obj.product.subcategories[0].name
                : '',
              'product_sku.price': obj.price,
              'product_sku.discount': obj.discount,
              'products.name': obj.product.name,
              'product_sku.is_stock': obj.is_stock
              // stock: obj.stock
            });
          });
          // console.log(skuData)
          setSkuData(tempArr);
          setParams({ ...params, offset: newOffset, page: newPage });
        },
        err => {
          console.log(err);
        }
      );
    } else {
      UserModel.getInstance().globalSearchProductSku(
        [
          {
            text: searchText,
            column_name: 'product_sku.name'
          }
        ],
        paramObj,
        async data => {
          console.log('data search', data);
          let tempArr = [];

          await data.forEach(obj => {
            tempArr.push({
              skuId: obj.id,
              'product_sku.name': obj.name,
              'product_sku.code': obj.code ? obj.code : 0,
              'user.name': obj.supplier ? obj.supplier[0].name : '',
              cat: obj.product ? obj.product.categories[0].name : '',
              subcat: obj.product.subcategories.length
                ? obj.product.subcategories[0].name
                : '',
              'product_sku.price': obj.price,
              'product_sku.discount': obj.discount,
              'products.name': obj.product.name,
              'product_sku.is_stock': obj.is_stock
              // stock: obj.stock
            });
          });
          // console.log(prodData)
          setSkuData(tempArr);
          setParams({ ...params, offset: newOffset, page: newPage });
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  const handlePreviousPage = () => {
    if (params.offset > 0) {
      const newOffset = params.offset - 20;
      const newPage = params.page - 1;
      const paramObj = { offset: newOffset };
      if (searchText == '') {
        UserModel.getInstance().getSku(
          paramObj,
          async data => {
            console.log(data);
            let tempArr = [];

            await data.forEach(obj => {
              tempArr.push({
                skuId: obj.id,
                'product_sku.name': obj.name,
                'product_sku.code': obj.code ? obj.code : 0,
                'user.name': obj.supplier ? obj.supplier[0].name : '',
                cat: obj.product ? obj.product.categories[0].name : '',
                subcat: obj.product.subcategories.length
                  ? obj.product.subcategories[0].name
                  : '',
                'product_sku.price': obj.price,
                'product_sku.discount': obj.discount,
                'products.name': obj.product.name,
                'product_sku.is_stock': obj.is_stock
                // stock: obj.stock
              });
            });
            // console.log(skuData)
            setSkuData(tempArr);
            setParams({ ...params, offset: newOffset, page: newPage });
          },
          err => {
            console.log(err);
          }
        );
      } else {
        UserModel.getInstance().globalSearchProductSku(
          [
            {
              text: searchText,
              column_name: 'product_sku.name'
            }
          ],
          paramObj,
          async data => {
            console.log('data search', data);
            let tempArr = [];

            await data.forEach(obj => {
              tempArr.push({
                skuId: obj.id,
                'product_sku.name': obj.name,
                'product_sku.code': obj.code ? obj.code : 0,
                'user.name': obj.supplier ? obj.supplier[0].name : '',
                cat: obj.product ? obj.product.categories[0].name : '',
                subcat: obj.product.subcategories.length
                  ? obj.product.subcategories[0].name
                  : '',
                'product_sku.price': obj.price,
                'product_sku.discount': obj.discount,
                'products.name': obj.product.name,
                'product_sku.is_stock': obj.is_stock
                // stock: obj.stock
              });
            });
            // console.log(prodData)
            setSkuData(tempArr);
            setParams({ ...params, offset: newOffset, page: newPage });
          },
          err => {
            console.log(err);
          }
        );
      }
    }
  };

  const handleSkuDownload = () => {
    UserModel.getInstance().downloadSku(
      { city_id: 1 },
      succ => {
        console.log('succ', succ);
        setCsvData(succ);
      },
      err => {
        console.log('err', err);
      }
    );
  };
  const handleChange = event => {
    setParams({
      ...params,
      [event.target.name]: event.target.value
    });
  };

  const filterChange = data => {
    console.log('data', data);
    if (params.page !== 1) {
      setParams({
        ...params,
        page: 1,
        offset: 0
      });
    }
    if (data.length > 0) {
      setSearchText(data[0].value);
      console.log('data 0', data[0]);
      UserModel.getInstance().globalSearchProductSku(
        [
          {
            column_name: 'product_sku.name',
            text: data[0].value
          }
        ],
        null,
        async data => {
          console.log('data search', data);
          let tempArr = [];

          await data.forEach(obj => {
            tempArr.push({
              skuId: obj.id,
              'product_sku.name': obj.name,
              'product_sku.code': obj.code ? obj.code : 0,
              'user.name': obj.supplier ? obj.supplier[0].name : '',
              cat: obj.product ? obj.product.categories[0].name : '',
              subcat: obj.product.subcategories.length
                ? obj.product.subcategories[0].name
                : '',
              'product_sku.price': obj.price,
              discount: obj.discount,
              'products.name': obj.product.name,
              'product_sku.is_stock': obj.is_stock
              // stock: obj.stock
            });
          });
          // console.log(prodData)
          setSkuData(tempArr);
        },
        err => {
          console.log('my err', err);
        }
      );
    } else {
      UserModel.getInstance().getSku(
        null,
        async data => {
          let tempArr = [];
          await data.forEach(obj => {
            console.log('sku', obj);
            tempArr.push({
              skuId: obj.id,
              'product_sku.name': obj.name,
              'product_sku.code': obj.code ? obj.code : 0,
              'user.name': obj.supplier ? obj.supplier[0].name : '',
              cat: obj.product ? obj.product.categories[0].name : '',
              subcat: obj.product.subcategories.length
                ? obj.product.subcategories[0].name
                : '',
              'product_sku.price': obj.price,
              discount: obj.discount,
              'products.name': obj.product.name,
              'product_sku.is_stock': obj.is_stock
              // stock: obj.stock
            });
          });
          setSkuData(tempArr);
          console.log(data);
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <TextField
        select
        label="City"
        name="cityId"
        value={params.cityId}
        onChange={handleChange}
        helperText="Please select City"
        variant="outlined">
        {cities.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <MaterialTable
        title="SKUs"
        columns={state.columns}
        data={skuData}
        options={{
          paging: false,
          filtering: true,
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
        onFilterChange={filterChange}
        className={clsx(classes.root, className)}
        actions={[
          {
            icon: 'add',
            tooltip: 'Add Sku',
            isFreeAction: true,
            onClick: () => {
              history.push('/add-sku');
            }
          },
          {
            icon: 'edit',
            tooltip: 'Edit Sku',
            onClick: (event, data) => {
              //   history.push({
              //     pathname: '/edit-sku',
              //     state: { skuId: data.skuId, supp: data.supplier }
              //   });
              // }
              history.push(`/edit-sku/${data.skuId}`);
            }
          }
        ]}
        editable={{
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(async () => {
                resolve();
                console.log(oldData.skuId);
                await UserModel.getInstance().removeSku(
                  oldData.skuId,
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
          return `Page ${params.page}`;
        }}
      />
    </MuiThemeProvider>
  );
};

SkuData.propTypes = {
  className: PropTypes.string
};

export default SkuData;
