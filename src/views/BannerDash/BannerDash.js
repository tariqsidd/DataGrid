import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import BannerData from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const BannerDash = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={8} md={12} xl={9} xs={12}>
          <BannerData />
        </Grid>
      </Grid>
    </div>
  );
};

export default BannerDash;
