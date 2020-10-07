import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  UserList as UserListView,
  Typography as TypographyView,
  Icons as IconsView,
  Account as AccountView,
  Settings as SettingsView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  SkuRequestsDash,
  SkuDash,
  ProductDash,
  BrandDash,
  SubcatDash,
  CategoryDash,
  CityDash,
  AddProduct,
  EditProd,
  AddSku,
  EditSku,
  RetailerDash,
  EditRetailer,
  AddRetailer,
  OrderDash,
  EditOrder,
  OrderDetail,
  AddManualOrder,
  SkuAggrDash,
  RoutingDash,
  AddRoute,
  VehicleDash,
  AddVehicle,
  EditVehicle,
  DriverDash,
  AddDriver,
  EditDriver,
  RouteDetails,
  SupplierDash,
  AddSupplier,
  EditSupplier,
  EditCategory,
  AddCategory,
  AddSubCategory,
  EditSubCategory,
  EditBrand,
  AddBrand,
  BatchUploadSku,
  AddOrderDetail,
  DealManager,
  AddDeal,
  DealDetails,
  AddBanner,
  EditBanner,
  BannerDash,
  DealSkuAdd,
  ActivateRetailer,
  AddBroadcastMessage,
  BroadcastMessagesDash,
  // EditBroadcastMessage,
  UserDash,
  EditUser,
  AddUser,
  ActivateUser,
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
        component={AddManualOrder}
        exact
        layout={MainLayout}
        path="/add-manual-order"
      />
      {/* <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      /> */}
      <RouteWithLayout
        component={SkuRequestsDash}
        exact
        layout={MainLayout}
        path="/sku-requests"
      />
      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/prods"
      />
      <RouteWithLayout
        component={TypographyView}
        exact
        layout={MainLayout}
        path="/typography"
      />
      <RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
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
        component={SkuDash}
        exact
        layout={MainLayout}
        path="/skus"
      />
      <RouteWithLayout
        component={AddSku}
        exact
        layout={MainLayout}
        path="/add-sku"
      />
      <RouteWithLayout
        component={ProductDash}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        component={AddProduct}
        exact
        layout={MainLayout}
        path="/add-prod"
      />
      <RouteWithLayout
        component={EditProd}
        exact
        layout={MainLayout}
        path="/edit-prod/:id"
      />
      <RouteWithLayout
        component={SubcatDash}
        exact
        layout={MainLayout}
        path="/subcategories"
      />
      <RouteWithLayout
        component={AddSubCategory}
        exact
        layout={MainLayout}
        path="/add-subcategory"
      />
      <RouteWithLayout
        component={EditSubCategory}
        exact
        layout={MainLayout}
        path="/edit-subcategory/:id"
      />
      <RouteWithLayout
        component={CityDash}
        exact
        layout={MainLayout}
        path="/cities"
      />
      <RouteWithLayout
        component={SkuDash}
        exact
        layout={MainLayout}
        path="/skus"
      />
      <RouteWithLayout
        component={AddSku}
        exact
        layout={MainLayout}
        path="/add-sku"
      />
      <RouteWithLayout
        component={EditSku}
        exact
        layout={MainLayout}
        path="/edit-sku/:id"
      />
      <RouteWithLayout
        component={ProductDash}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        component={AddProduct}
        exact
        layout={MainLayout}
        path="/add-prod"
      />
      <RouteWithLayout
        component={EditProd}
        exact
        layout={MainLayout}
        path="/edit-prod"
      />
      <RouteWithLayout
        component={BrandDash}
        exact
        layout={MainLayout}
        path="/brands"
      />
      <RouteWithLayout
        component={EditBrand}
        exact
        layout={MainLayout}
        path="/edit-brand/:id"
      />
      <RouteWithLayout
        component={AddBrand}
        exact
        layout={MainLayout}
        path="/add-brand"
      />
      <RouteWithLayout
        component={SubcatDash}
        exact
        layout={MainLayout}
        path="/subcategories"
      />
      <RouteWithLayout
        component={CategoryDash}
        exact
        layout={MainLayout}
        path="/categories"
      />
      <RouteWithLayout
        component={EditCategory}
        exact
        layout={MainLayout}
        path="/edit-category/:id"
      />
      <RouteWithLayout
        component={AddCategory}
        exact
        layout={MainLayout}
        path="/add-category"
      />
      <RouteWithLayout
        component={CityDash}
        exact
        layout={MainLayout}
        path="/cities"
      />
      <RouteWithLayout
        component={RetailerDash}
        exact
        layout={MainLayout}
        path="/retailers"
      />
      <RouteWithLayout
        component={ActivateRetailer}
        exact
        layout={MainLayout}
        path="/retailer/:id"
      />
      <RouteWithLayout
        component={EditRetailer}
        exact
        layout={MainLayout}
        path="/edit-retailer/:id"
      />
      <RouteWithLayout
        component={AddRetailer}
        exact
        layout={MainLayout}
        path="/add-retailer"
      />
      <RouteWithLayout
        component={OrderDash}
        exact
        layout={MainLayout}
        path="/orders"
      />
      <RouteWithLayout
        component={EditOrder}
        exact
        layout={MainLayout}
        path="/orders/edit-order/:id"
      />
      <RouteWithLayout
        component={OrderDetail}
        exact
        layout={MainLayout}
        path="/orders/order-detail/:id"
      />
      <RouteWithLayout
        component={AddOrderDetail}
        exact
        layout={MainLayout}
        path="/orders/add-order-detail/:id"
      />
      <RouteWithLayout
        component={VehicleDash}
        exact
        layout={MainLayout}
        path="/vehicles"
      />
      <RouteWithLayout
        component={AddVehicle}
        exact
        layout={MainLayout}
        path="/vehicles/add-vehicle"
      />
      <RouteWithLayout
        component={EditVehicle}
        exact
        layout={MainLayout}
        path="/vehicles/edit-vehicle/:id"
      />
      <RouteWithLayout
        component={DriverDash}
        exact
        layout={MainLayout}
        path="/drivers"
      />
      <RouteWithLayout
        component={AddDriver}
        exact
        layout={MainLayout}
        path="/drivers/add-driver"
      />
      <RouteWithLayout
        component={EditDriver}
        exact
        layout={MainLayout}
        path="/drivers/edit-driver/:id"
      />
      <RouteWithLayout
        component={SkuAggrDash}
        exact
        layout={MainLayout}
        path="/sku-aggregates"
      />
      <RouteWithLayout
        component={SupplierDash}
        exact
        layout={MainLayout}
        path="/supplier"
      />
      <RouteWithLayout
        component={AddSupplier}
        exact
        layout={MainLayout}
        path="/supplier/add-supplier"
      />
      <RouteWithLayout
        component={EditSupplier}
        exact
        layout={MainLayout}
        path="/supplier/edit-supplier/:id"
      />
      <RouteWithLayout
        component={RoutingDash}
        exact
        layout={MainLayout}
        path="/routes"
      />
      <RouteWithLayout
        component={AddRoute}
        exact
        layout={MainLayout}
        path="/routes/add-route"
      />

      <RouteWithLayout
        component={BatchUploadSku}
        exact
        layout={MainLayout}
        path="/batch-upload"
      />

      <RouteWithLayout
        component={DealManager}
        exact
        layout={MainLayout}
        path="/deal-manager"
      />

      <RouteWithLayout
        component={AddDeal}
        exact
        layout={MainLayout}
        path="/deal-manager/add-deal"
      />

      <RouteWithLayout
        component={DealDetails}
        exact
        layout={MainLayout}
        path="/deal-manager/deal-details/:id"
      />

      <RouteWithLayout
        component={BannerDash}
        exact
        layout={MainLayout}
        path="/banners"
      />
      <RouteWithLayout
        component={AddBanner}
        exact
        layout={MainLayout}
        path="/add-banner"
      />
      <RouteWithLayout
        component={EditBanner}
        exact
        layout={MainLayout}
        path="/edit-banner/:bannerId"
      />
      <RouteWithLayout
        component={RouteDetails}
        exact
        layout={MainLayout}
        path="/routes/:route"
      />
      <RouteWithLayout
        component={DealSkuAdd}
        exact
        layout={MainLayout}
        path="/deal-sku-add"
      />
      <RouteWithLayout
        component={BroadcastMessagesDash}
        exact
        layout={MainLayout}
        path="/broadcast-messages"
      />
      <RouteWithLayout
        component={AddBroadcastMessage}
        exact
        layout={MainLayout}
        path="/add-broadcast-message"
      />
      {/* <RouteWithLayout
        component={EditBroadcastMessage}
        exact
        layout={MainLayout}
        path="/edit-broadcast-message/:BroadcastMessageId"
      /> */}

      <RouteWithLayout
        component={UserDash}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={ActivateUser}
        exact
        layout={MainLayout}
        path="/user/:id"
      />
      <RouteWithLayout
        component={EditUser}
        exact
        layout={MainLayout}
        path="/edit-user/:id"
      />
      <RouteWithLayout
        component={AddUser}
        exact
        layout={MainLayout}
        path="/add-user"
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
