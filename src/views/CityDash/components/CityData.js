import React, { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
  createMuiTheme
} from '@material-ui/core';
import MaterialTable from 'material-table';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import mockData from './data';
import { StatusBullet } from 'components';
import createPalette from '@material-ui/core/styles/createPalette';

// const useStyles = makeStyles(theme => ({
//   root: {},
//   content: {
//     padding: 0
//   },
//   inner: {
//     minWidth: 800
//   },
//   statusContainer: {
//     display: 'flex',
//     alignItems: 'center'
//   },
//   status: {
//     marginRight: theme.spacing(1)
//   },
//   actions: {
//     justifyContent: 'flex-end'
//   }
// }));

const statusColors = {
  delivered: 'success',
  pending: 'info',
  refunded: 'danger'
};

const CityData = props => {
  const { className, ...rest } = props;

  // const classes = useStyles();

  const [data] = useState(mockData);
  const [state, setState] = React.useState({
    columns: [
      {title: 'City Id', field: 'cityId', editable: 'never'},
      {title: 'City', field: 'city'},
    ],
    data:data
  })

  const theme = createMuiTheme({
    typography: {
      fontFamily: "Nunito Sans, Roboto, sans-serif"
    }
  });

  return (
    <MuiThemeProvider theme={theme} >
    <MaterialTable
    title = "SKUs"
      columns={state.columns}
      data={state.data}
      // className={clsx(classes.root, className)}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
      >

    </MaterialTable>
    </MuiThemeProvider>
  );
};

CityData.propTypes = {
  className: PropTypes.string
};

export default CityData;
