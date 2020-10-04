import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import SkuAggrData from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const SkuAggrDash = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={8} md={12} xl={9} xs={12}>
          <SkuAggrData />
        </Grid>
      </Grid>
    </div>
  );
};

export default SkuAggrDash;
