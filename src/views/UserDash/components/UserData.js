import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
// import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useHistory } from 'react-router-dom';
import PropTypes, { func } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  MuiThemeProvider,
  createMuiTheme,
  TablePagination
} from '@material-ui/core';
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

const UserData = props => {
  var [userData, setUserData] = useState([]);
  const [state, setState] = React.useState([
    { title: 'User Id', field: 'users.id', editable: 'never' },
    { title: 'User Name', field: 'users.name', editable: 'never', filtering:true },
    { title: 'Email', field: 'users.email', editable: 'never' },
    { title: 'Role', field: 'user_roles.name', editable: 'never', filtering:true },
    { title: 'Mobile', field: 'users.mobile', editable: 'never', filterPlaceholder:'eg: 33XXXXXXXX' },
    { title: 'Status', field: 'users.is_verify', editable: 'never', filtering:true },
  ]);

  // const [roleData, setRoleData] = useState([
  //   {id: 1, name: 'Admin'},
  //   {id: 2, name: 'Supplier'},
  //   {id: 3, name: 'Retailer'},
  //   {id: 4, name: 'Driver'},
  //   {id: 5, name: 'Sales'},
  // ])
  const [params, setParams] = useState({
    page: 1,
    offset: 0
  });

  useEffect(() => {
    UserModel.getInstance().getUsersList(
      null,
      async data => {
        console.log(data);
        let tempArr = [];

        await data.forEach(obj => {
          tempArr.push({
            'users.id': obj.id,
            'users.name': obj.name,
            'users.email': obj.email,
            'users.mobile': obj.mobile,
            'users.is_verify': obj.is_verify,
            roleId: obj.role_id,
            'user_roles.name': obj.role_name,
          });
        });
        // console.log(userData)
        setUserData(tempArr);
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

  const handleNextPage = async () => {
    const newOffset = params.offset + 20;
    const paramObj = { offset: newOffset };
    const newPage = params.page + 1;
    UserModel.getInstance().getUsersList(
      paramObj,
      async data => {
        console.log(data);
        let tempArr = [];

        await data.forEach(obj => {
          tempArr.push({
            'users.id': obj.id,
            'users.name': obj.name,
            'users.email': obj.email,
            'users.mobile': obj.mobile,
            'users.is_verify': obj.is_verify,
            roleId: obj.role_id,
            'user_roles.name': obj.role_name,
          });
        });
        setUserData(tempArr);
        setParams({ ...params, offset: newOffset, page: newPage });
      },
      err => {
        console.log(err);
      }
    );
  };

  const handlePreviousPage = async () => {
    if (params.offset > 0) {
      const newOffset = params.offset - 20;
      const paramObj = { offset: newOffset };
      const newPage = params.page - 1;
      UserModel.getInstance().getUsersList(
        paramObj,
        async data => {
          console.log(data);
          let tempArr = [];

          await data.forEach(obj => {
            tempArr.push({
              'users.id': obj.id,
              'users.name': obj.name,
              'users.email': obj.email,
              'users.mobile': obj.mobile,
              'users.is_verify': obj.is_verify,  
              roleId: obj.role_id,
              'user_roles.name': obj.role_name,
            });
          });
          // console.log(userData)
          setUserData(tempArr);
          setParams({ ...params, offset: newOffset, page: newPage });
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  const handleRowClick = (event, data) => {
    history.push(`/user/${data['users.id']}`);
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

    if(data.length>0){
      let searchArray = [];
      data.map((x,i)=>{
       console.log('map data value',x.value)
       searchArray.push({ 
       column_name: x.column.field,
       text: x.value
       })
      })
      // console.log('search Array',searchArray)
      console.log('............................................searxh')
      UserModel.getInstance().globalSearchUsers(
        searchArray,
        null,
        async data => {
          console.log('data search', data);
          let tempArr = [];
  
          await data.forEach(obj => {
            tempArr.push({
              'users.id': obj.id,
              'users.name': obj.name,
              'users.email': obj.email,
              'users.mobile': obj.mobile,
              'users.is_verify': obj.is_verify,
              'user_roles.name': obj.role_name,
              roleId: obj.role_id,
            });
          });
          // console.log(retailerData)
          setUserData(tempArr);
        },
        err => {
          console.log('my err', err);
        }
      );
    }
    else {
      UserModel.getInstance().getUsersList(
        null,
        async data => {
          console.log(data);
          let tempArr = [];
  
          await data.forEach(obj => {
            tempArr.push({
              'users.id': obj.id,
              'users.name': obj.name,
              'users.email': obj.email,
              'users.mobile': obj.mobile,
              'users.is_verify': obj.is_verify,  
              'user_roles.name': obj.role_name,
              roleId: obj.role_id,
            });
          });
          // console.log(userData)
          setUserData(tempArr);
        },
        err => {
          console.log(err);
        }
      );
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        title="Users"
        columns={state}
        data={userData}
        className={clsx(classes.root, className)}
        options={{
          paging: false,
          filtering:true
        }}
        onFilterChange={filterChange}
        onRowClick={handleRowClick}
        actions={
          [
            {
              icon: 'add',
              tooltip: 'Add User',
              isFreeAction: true,
              onClick: () => {
                history.push('/add-user');
              }
            },
            {
              icon: 'edit',
              tooltip: 'Edit User',
              onClick: (event, data) => { 
                console.log({event, data})
                history.push(`/edit-user/${data['users.id']}`); // User info fetch info not ready so only passing switch status 
              }
            }
          ]
        }
        // editable={{
        //   onRowDelete: oldData =>
        //     new Promise(resolve => {
        //       setTimeout(() => {
        //         resolve();
        //         console.log(oldData);
        //         UserModel.getInstance().removeUser(
        //           oldData['users.id'],
        //           resData => {
        //             console.log(resData);
        //             window.location.reload();
        //           },
        //           err => {
        //             console.log(err);
        //           }
        //         );
        // setUserData((prevState) => {
        //   userData.splice(userData.indexOf(oldData), 1);
        //   return [...prevState, userData];
        // });
        //       }, 600);
        //     })
        // }}
      ></MaterialTable>
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

UserData.propTypes = {
  className: PropTypes.string
};

export default UserData;
