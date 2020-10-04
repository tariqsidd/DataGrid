import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import ListAltIcon from '@material-ui/icons/ListAlt';

import { Profile, SidebarNav } from './components';
import Version from './components/Version/version';
import { DealSkuAdd } from 'views';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'Products',
      href: '/products',
      icon: <ShoppingBasketIcon />
    },
    {
      title: 'SKUs',
      href: '/skus',
      icon: <ShoppingBasketIcon />
    },
    {
      title: 'Deal SKUs',
      href: '/deal-sku-add'
    },
    {
      title: 'Deals',
      href: '/deal-manager',
      icon: <ShoppingBasketIcon />
    },
    {
      title: 'Orders',
      href: '/orders',
      icon: <ListAltIcon />
    },
    {
      title: 'Vehicles',
      href: '/vehicles',
      icon: <DriveEtaIcon />
    },
    {
      title: 'Drivers',
      href: '/drivers',
      icon: <DriveEtaIcon />
    },
    {
      title: 'Brands',
      href: '/brands'
    },
    {
      title: 'Subcategories',
      href: '/subcategories'
    },
    {
      title: 'Categories',
      href: '/categories'
    },
    {
      title: 'Cities',
      href: '/cities'
    },
    {
      title: 'Retailers',
      href: '/retailers'
    },
    {
      title: 'Users',
      href: '/users'
    },
    {
      title: 'Suppliers',
      href: '/supplier'
    },
    {
      title: 'Daily Sku Aggregates',
      href: '/sku-aggregates'
    },
    {
      title: 'Routes',
      href: '/routes'
    },
    {
      title: 'Batch Update SKU',
      href: '/batch-upload'
    },
    {
      title: 'Banners',
      href: '/banners'
    },
    {
      title: 'SKU Requests',
      href: '/sku-requests'
    },
    {
      title: 'Broadcast Messages',
      href: '/broadcast-messages'
    }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}>
      <div {...rest} className={clsx(classes.root, className)}>
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav className={classes.nav} pages={pages} />
        <Version />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
