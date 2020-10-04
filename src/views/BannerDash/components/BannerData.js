import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme, TablePagination } from '@material-ui/core';
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


const BannerData = props => {
  const [params, setParams] = useState({
    page: 1,
    offset: 0,
  })
  
  const typeData = [
    { id: 1, name: 'Deal' },
    { id: 2, name: 'Product Sku' },
    { id: 3, name: 'Link' }
  ]

  var [searchText, setSearchText] = useState('');

  useEffect(() => {
    UserModel.getInstance().getBanner(
      null,
      async data => {
        let tempArr = [];
        console.log(data);
        await data.forEach(obj => {
          // console.log('banner', obj)
          console.log(obj.type, typeData[obj.type-1])
          tempArr.push({
            bannerId: obj.id,
            name: obj.name,
            type: typeData[obj.type-1].name,
            is_active: obj.is_active ? 'active' : 'de-active'
          });
        });
        setBannerData(tempArr);
      },
      err => {
        console.log(err);
      }
    );
  }, []);

  let history = useHistory();
  const { className, ...rest } = props;

  // const [data] = useState(mockData);
  const classes = useStyles();
  const [bannerData, setBannerData] = useState([]);

  const [state, setState] = React.useState({
    columns: [
      { title: 'Banner name', field: 'name', editable: 'never', filtering: true },
      { title: 'Banner Type', field: 'type' },
      { title: 'Is Active', field: 'is_active' },
    ]
  });

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
    if (searchText == '') {
      UserModel.getInstance().getBanner(
        paramObj,
        async data => {
          console.log(data);
          let tempArr = [];

          await data.forEach(obj => {
            tempArr.push({
              bannerId: obj.id,
              name: obj.name,
              type: typeData[obj.type-1].name,
              is_active: obj.is_active ? 'active' : 'de-active'
            });
          });
          // console.log(bannerData)
          setBannerData(tempArr);
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
    //           bannerId: obj.id,
    //           name: obj.name,
    //           type: typeData[obj.type-1].name,
    //           is_active: obj.is_active ? 'active' : 'de-active'
    //         });
    //       });
    //       // console.log(prodData)
    //       setBannerData(tempArr);
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
        UserModel.getInstance().getBanner(
          paramObj,
          async data => {
            console.log(data);
            let tempArr = [];

            await data.forEach(obj => {
              tempArr.push({
                bannerId: obj.id,
                name: obj.name,
                type: typeData[obj.type-1].name,
                is_active: obj.is_active ? 'active' : 'de-active'
              });
            });
            // console.log(bannerData)
            setBannerData(tempArr);
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
      //           bannerId: obj.id,
      //           name: obj.name,
      //           type: typeData[obj.type-1].name,
      //           is_active: obj.is_active ? 'active' : 'de-active'
      //         });
      //       });
      //       // console.log(prodData)
      //       setBannerData(tempArr);
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
  //     //         bannerId: obj.id,
  //     //         name: obj.name,
  //     //         type: typeData[obj.type-1].name,
  //     //         is_active: obj.is_active ? 'active' : 'de-active'
  //     //       });
  //     //     });
  //     //     // console.log(prodData)
  //     //     setBannerData(tempArr);

  //     //   },
  //     //   err => {
  //     //     console.log('my err', err)
  //     //   }
  //     // )
  //   }
  //   else {
  //     UserModel.getInstance().getBanner(
  //       null,
  //       async data => {
  //         let tempArr = [];
  //         await data.forEach(obj => {
  //           console.log('banner', obj)
  //           tempArr.push({
  //             bannerId: obj.id,
  //             name: obj.name,
  //             type: typeData[obj.type-1].name,
  //             is_active: obj.is_active ? 'active' : 'de-active'
  //           });
  //         });
  //         setBannerData(tempArr);
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
        title="Banners"
        columns={state.columns}
        data={bannerData}
        options={{
          paging: false,
          filtering: true,
          search: false,
        }}

        // onFilterChange={filterChange}
        className={clsx(classes.root, className)}
        actions={[
          {
            icon: 'add',
            tooltip: 'Add Banner',
            isFreeAction: true,
            onClick: () => {
              history.push('/add-banner');
            }
          },
          {
            icon: 'edit',
            tooltip: 'Edit Banner',
            onClick: (event, data) => {
              //   history.push({
              //     pathname: '/edit-banner',
              //     state: { bannerId: data.bannerId, supp: data.supplier }
              //   });
              // }
              history.push(`/edit-banner/${data.bannerId}`);
            }
          }
        ]}
        editable={{
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(async () => {
                resolve();
                console.log(oldData.bannerId);
                const id = oldData.bannerId;
                await UserModel.getInstance().removeBanner(
                  id,
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
        }}
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

BannerData.propTypes = {
  className: PropTypes.string
};

export default BannerData;
