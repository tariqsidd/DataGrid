import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  ManualOrderDash,
  AddManualOrder,
  EditManualOrder,
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/dashboard" />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={ManualOrderDash}
        exact
        layout={MainLayout}
        path="/manual-orders"
      />
      <RouteWithLayout
        component={AddManualOrder}
        exact
        layout={MainLayout}
        path="/add-manual-order"
      />
      <RouteWithLayout
        component={EditManualOrder}
        exact
        layout={MainLayout}
        path="/manual-order/edit-manual-order-detail/:id"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
