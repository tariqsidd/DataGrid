import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: 'none'
  },
  dastgyr: {
    borderRadius: 3,
    border: 0,
    color: 'white',
    fontSize: '35px',
    height: 48,
    padding: '0 30px',
    fontFamily: 'Nunito Sans, Roboto, sans-serif'
  }
}));

const Topbar = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar
      {...rest}
      style={{
        background: 'linear-gradient(to right, #0f2027 0%, #2c5364 100%)'
      }}
      color="primary"
      position="fixed">
      <Toolbar>
        <RouterLink to="/">
          {/* <img
            alt="Logo"
            src="/images/logos/logo--white.svg"
          /> */}
          <span className={clsx(classes.dastgyr, className)}>Dastgyr</span>
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string
};

export default Topbar;
