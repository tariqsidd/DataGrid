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
import TextField from '@material-ui/core/TextField';

import UserModel from 'models/UserModel';
import MaterialTable from 'material-table';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { filter } from 'underscore';

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

const ProdData = props => {
  var [prodData, setProdData] = useState([]);
  var [searchText, setSearchText] = useState('');
  const [state, setState] = React.useState([
   
    { title: 'Product Name', field: 'prodName', editable:'never',filterPlaceholder:'search'},
    { title: 'Brand', field: 'brand',filtering:false, editable: 'never' },
    { title: 'Category', field: 'cat', editable: 'never',filtering:false },
    { title: 'Subcategory', field: 'subcat', editable: 'never',filtering:false }
  ]);
  const [params, setParams] = useState({
    page: 1,
    offset: 0,
    showCalendar: false,
    xx:true
  });
  const [dateSelRange, setDateSelRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), -7),
      key: 'selection'
    }
  ]);

  useEffect(() => {
    UserModel.getInstance().getProduct(
      null,
      async data => {
        console.log("xx",data);
        let tempArr = [];

        await data.forEach(obj => {
          tempArr.push({
            prodId: obj.id,
            prodName: obj.name,
            brand: obj.brand_name,
            cat: obj.categories.length > 0 ? obj.categories[0].name : '',
            subcat:
              obj.subcategories.length > 0 ? obj.subcategories[0].name : ''
          });
        });
        // console.log(prodData)
        setProdData(tempArr);
      },
      err => {
        console.log(err);
      }
    );
  }, []);

  const { className, ...rest } = props;
  let history = useHistory();

  const classes = useStyles();
  console.log(prodData);

  // const [data] = useState(mockData);

  const theme = createMuiTheme({
    typography: {
      fontFamily: 'Nunito Sans, Roboto, sans-serif'
    }
  });

  const handleNextPage = () => {
    console.log('offset',params.offset)
    console.log(params);
    console.log('search text',searchText)
    const newOffset = params.offset + 1;
    const paramObj = { offset: newOffset };
    const newPage = params.page + 1;
    if(searchText==''){
 
      UserModel.getInstance().getProduct(
        paramObj,
        async data => {
          console.log(data);
          let tempArr = [];
  
          await data.forEach(obj => {
            tempArr.push({
              prodId: obj.id,
              prodName: obj.name,
              brand: obj.brand_name,
              cat: obj.categories[0].name,
              subcat:
                obj.subcategories.length > 0 ? obj.subcategories[0].name : ''
            });
          });
          // console.log(prodData)
          setProdData(tempArr);
          setParams({ ...params, offset: newOffset, page: newPage });
        },
        err => {
          console.log(err);
        }
      );

    }
    else {
      UserModel.getInstance().globalSearchProduct(
        {
          text:searchText,
          column_name:'products'
        },
        paramObj,
        async data => {
          console.log('data search',data);
          let tempArr = [];
  
          await data.forEach(obj => {
            tempArr.push({
              prodId: obj.id,
              prodName: obj.name,
              brand: obj.brand_name,
              cat: obj.categories.length > 0 ? obj.categories[0].name : '',
              subcat:
                obj.subcategories.length > 0 ? obj.subcategories[0].name : ''
            });
          });
          // console.log(prodData)
          setProdData(tempArr);
          setParams({ ...params, offset: newOffset, page: newPage });
  
        },
        err => {
          console.log(err)
        }
      )
    }
   
  };

  const handlePreviousPage = () => {
    if (params.offset > 0) {
      const newOffset = params.offset - 20;
      const newPage = params.page - 1;
      const paramObj = { offset: newOffset };
      if(searchText==''){
        UserModel.getInstance().getProduct(
          paramObj,
          async data => {
            console.log(data);
            let tempArr = [];
  
            await data.forEach(obj => {
              tempArr.push({
                prodId: obj.id,
                prodName: obj.name,
                brand: obj.brand_name,
                cat: obj.categories[0].name,
                subcat:
                  obj.subcategories.length > 0 ? obj.subcategories[0].name : ''
              });
            });
            // console.log(prodData)
            setProdData(tempArr);
            setParams({ ...params, offset: newOffset, page: newPage });
          },
          err => {
            console.log(err);
          }
        );
      }
      else {
        UserModel.getInstance().globalSearchProduct(
          {
            text:searchText,
            column_name:'products'
          },
          paramObj,
          async data => {
            console.log('data search',data);
            let tempArr = [];
    
            await data.forEach(obj => {
              tempArr.push({
                prodId: obj.id,
                prodName: obj.name,
                brand: obj.brand_name,
                cat: obj.categories.length > 0 ? obj.categories[0].name : '',
                subcat:
                  obj.subcategories.length > 0 ? obj.subcategories[0].name : ''
              });
            });
            // console.log(prodData)
            setProdData(tempArr);
            setParams({ ...params, offset: newOffset, page: newPage });
    
          },
          err => {
            console.log(err)
          }
        )
      }
    }
  };

  const handleDateChange = async item => {
    await setDateSelRange([item.selection]);
    console.log(item);
  };

  const searchProduct = async item => {
    console.log('item',item.length)
    if(item.length>0){
      UserModel.getInstance().searchProduct(
        item,
        async data => {
          console.log('data',data);
          let tempArr = [];
  
          await data.forEach(obj => {
            tempArr.push({
              prodId: obj.id,
              prodName: obj.name,
              brand: obj.brand_name,
              cat: obj.categories.length > 0 ? obj.categories[0].name : '',
              subcat:
                obj.subcategories.length > 0 ? obj.subcategories[0].name : ''
            });
          });
          // console.log(prodData)
          setProdData(tempArr);
  
        },
        err => {
          console.log(err)
        }
      )
    }
    else{
      UserModel.getInstance().getProduct(
        null,
        async data => {
          console.log('data',data);
          let tempArr = [];
  
          await data.forEach(obj => {
            tempArr.push({
              prodId: obj.id,
              prodName: obj.name,
              brand: obj.brand_name,
              cat: obj.categories.length > 0 ? obj.categories[0].name : '',
              subcat:
                obj.subcategories.length > 0 ? obj.subcategories[0].name : ''
            });
          });
          // console.log(prodData)
          setProdData(tempArr);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  const filterChange = (data)=>{
     console.log('data',data.length)
    if(params.page !== 1){
      setParams({
        ...params,
        page:1,
        offset:0
      })
    }
     if(data.length>0){
      setSearchText(data[0].value)
      UserModel.getInstance().globalSearchProduct(
        {
          column_name:'products',
          text: data[0].value
        
        },
        null,
        async data => {
          console.log('data search',data);
          let tempArr = [];
  
          await data.forEach(obj => {
            tempArr.push({
              prodId: obj.id,
              prodName: obj.name,
              brand: obj.brand_name,
              cat: obj.categories.length > 0 ? obj.categories[0].name : '',
              subcat:
                obj.subcategories.length > 0 ? obj.subcategories[0].name : ''
            });
          });
          // console.log(prodData)
          setProdData(tempArr);
  
        },
        err => {
          console.log('my err',err)
        }
      )
     }
     else{
      UserModel.getInstance().getProduct(
        null,
        async data => {
          console.log('data',data);
          let tempArr = [];
  
          await data.forEach(obj => {
            tempArr.push({
              prodId: obj.id,
              prodName: obj.name,
              brand: obj.brand_name,
              cat: obj.categories.length > 0 ? obj.categories[0].name : '',
              subcat:
                obj.subcategories.length > 0 ? obj.subcategories[0].name : ''
            });
          });
          // console.log(prodData)
          setSearchText('');
          setParams({...params, page:1,offset:0})
          setProdData(tempArr);
        },
        err => {
          console.log(err);
        }
      );
    }

  }

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
        title="Products"
        columns={state}
        data={prodData}
        // onSearchChange={searchProduct}
        //onFilterChange?: (filters: Filter<RowData>[]) => void;
        onFilterChange={filterChange}
        className={clsx(classes.root, className)}
        options={{
          paging: false,
          exportButton: true,
          exportAllData: true,
          filtering:true,
          search:false
        }}
        // components={{
        //   FilterRow: props => (
        //     <tr>
        //       <td style={{ width: "48px" }} />
        //       {props.columns.map(column => (
        //         <td>
        //      <TextField
        //     {...params}
        //     label="Search input"
        //     margin="normal"
        //     variant="outlined"
        //     InputProps={{ ...params.InputProps, type: 'search' }}
        //   />
        //         </td>
        //       ))}
        //     </tr>
        //   )
        // }}
           
        actions={[
          {
            icon: 'add',
            tooltip: 'Add Product',
            isFreeAction: true,
            onClick: () => {
              history.push('/add-prod');
            }
          },
          {
            icon: 'edit',
            tooltip: 'Edit Product',
            onClick: (event, data) => {
              history.push(`/edit-prod/${data.prodId}`);
            }
          },
          // {
          //   icon: CalendarTodayIcon,
          //   isFreeAction: true,
          //   onClick: (event, data) => {
          //     if (params.showCalendar) {
          //       setParams({ ...params, showCalendar: false });
          //     } else {
          //       setParams({ ...params, showCalendar: true });
          //     }
          //   }
          // },
          
        ]}
        editable={{
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                console.log(oldData);
                UserModel.getInstance().removeProduct(
                  oldData.prodId,
                  resData => {
                    console.log(resData);
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
          return `page ${params.page}`;
        }}
      />
    </MuiThemeProvider>
  );
};

ProdData.propTypes = {
  className: PropTypes.string
};

export default ProdData;
