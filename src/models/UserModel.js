import ApiManager from '../helpers/NW/Api';

export default class UserModel {
  static myInstance = null;
  static getInstance() {
    if (UserModel.myInstance === null) {
      UserModel.myInstance = new UserModel();
    }
    return this.myInstance;
  }

  isAuth() {
    if (localStorage.getItem('sales-auth-token')) {
      return true;
    }
    return false;
  }

  signOut() {
    localStorage.removeItem('sales-auth-token');
    window.location.href = '/sign-in';
  }

  getToken() {
    return localStorage.getItem('sales-auth-token');
  }
  saveToken(token) {
    localStorage.setItem('sales-auth-token', token);
  }

  getUserRole() {
    return localStorage.getItem('user_role');
  }

  Login(mobile, password, successTrigger, failureTrigger) {
    ApiManager.getInstance().Login(
      mobile,
      password,
      function resSuccess(user) {
        console.log('user', user);
        UserModel.getInstance().saveToken(user.token, user.user_role_id);
        successTrigger(user);
      },
      
      function resFailed(msg) {
        console.log('Error: ' + msg);
        failureTrigger(msg);
      }
    );
  }

  getUsersListFromMobile(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getUsersListFromMobile(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getSkuByName(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getSkuByName(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  postManualOrder(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().postManualOrder(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getOrderLog(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getOrderLog(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  downloadOrderDetails(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().downloadOrderDetails(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  globalSearchOrder(params, paramObj, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    console.log('param usermodel', params);
    ApiManager.getInstance().globalSearchOrder(
      token,
      params,
      paramObj,
      function resSuccess(data) {
        //console.log({ data });
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  
  getOrderDetail(orderDetailId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getOrderDetail(
      token,
      orderDetailId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }
  
  addOrderDetail(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addOrderDetail(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  removeOrderDetail(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeOrderDetail(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  updateOrderStatus(order_id, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().updateOrderStatus(
      token,
      order_id,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }




  // Sku Requests
  getSkuRequests(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getSkuRequests(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  //Retailers section start
  addRetailer(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addRetailer(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        console.log(msg);
        failureTrigger(msg);
      }
    );
  }

  getRetailerDetails(userId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getRetailerDetails(
      token,
      userId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  updateRetailer(userid, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().updateRetailer(
      token,
      userid,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  getRetailersList(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getRetailersList(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  retailerChangePassword(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().retailerChangePassword(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  retailerActivation(userId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().retailerActivation(
      token,
      userId,
      params,
      function resSuccess(data) {
        UserModel.getInstance().UserList.forEach((user, index) => {
          if (user.id === userId) {
            user.is_active = params.is_active;
            successTrigger(data);
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  downloadRetailers(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().downloadRetailers(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  searchRetailersList(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().searchRetailersList(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  globalSearchRetailer(params, paramObj, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    console.log('param usermodel', params);
    ApiManager.getInstance().globalSearchRetailer(
      token,
      params,
      paramObj,
      function resSuccess(data) {
        console.log({ data });
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  removeRetailer(userId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeRetailer(
      token,
      userId,
      function resSuccess() {
        UserModel.getInstance().UserList.forEach((user, index) => {
          if (user.id === userId) {
            UserModel.getInstance().UserList.splice(index, 1);
            successTrigger();
          }
        });
        successTrigger();
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  //End user section

  getCustomerList(successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getUsersList(
      token,
      function resSuccess(data) {
        let list = [];
        data.forEach(user => {
          user.user_types.forEach(type => {
            if (type.name === 'Customer') {
              list.push(user);
            }
          });
        });
        UserModel.getInstance().CustomerList = list;
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  //Product section
  getProduct(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getProduct(
      token,
      params,
      function resSuccess(data) {
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  //Product Edit section
  getEditProduct(productId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getEditProduct(
      token,
      productId,
      function resSuccess(data) {
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  searchProduct(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().searchProduct(
      token,
      params,
      function resSuccess(data) {
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  productExist(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().productExist(
      token,
      params,
      function resSuccess(data) {
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  globalSearchProduct(params, paramObj, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().globalSearchProduct(
      token,
      params,
      paramObj,
      function resSuccess(data) {
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  globalSearchProductSku(params, paramObj, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    console.log('param usermodel', params[0].column_name);
    ApiManager.getInstance().globalSearchProductSku(
      token,
      params,
      paramObj,
      function resSuccess(data) {
        console.log({ data });
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getProductDetail(productId, successCallback, failureCallback) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getPaymentDetail(
      token,
      productId,
      function resSuccess(data) {
        successCallback(data);
      },
      function resFailed(msg) {
        failureCallback(msg);
      }
    );
  }

  removeProduct(productId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeProduct(
      token,
      productId,
      function resSuccess(data) {
        successTrigger(data);
        // UserModel.getInstance().productList.forEach((product, index) => {
        //     if (product.id === productId) {
        //         UserModel.getInstance().productList.splice(index, 1);
        //         successTrigger(data)
        //     }
        // });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  addProduct(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addProduct(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  updateProduct(productId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().updateProduct(
      token,
      productId,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }
  //End product section

  //Start Sku section
  getSku(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getSku(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getAggregateSku(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getAggregateSku(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getAllSkuData(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getAllSkuData(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  downloadSku(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().downloadSku(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  getSingleSku(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getSingleSku(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  removeSku(skuId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeSku(
      token,
      skuId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  addSku(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addSku(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  updateSku(skuId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().updateSku(
      token,
      skuId,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  searchSku(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().searchSku(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  //End sku section

  //Start supplier section
  getSupplier(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getSupplier(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  searchSupplier(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().searchSupplier(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  //End supplier section

  //Start brand section
  getBrand(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getBrand(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  brandExist(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().brandExist(
      token,
      params,
      function resSuccess(data) {
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  updateBrand(brand_ID, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().updateBrand(
      token,
      brand_ID,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  addBrand(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addBrand(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  getBrandDetail(brand_ID, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    console.log({ token, brand_ID, successTrigger, failureTrigger });
    ApiManager.getInstance().getBrandDetail(
      token,
      brand_ID,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  searchBrand(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().searchBrand(
      token,
      params,
      function resSuccess(data) {
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  //End brand section

  programAssociation(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().programAssociation(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  // start payment mode
  getPayment(successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getPayment(
      token,
      function resSuccess(data) {
        // console.log('data', data);
        UserModel.getInstance().PaymentList = data.payment_modes;
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  addPayment(name, arabic_name, successTrigger, failureTrigger) {
    let params = {
      name,
      arabic_name
    };
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addPayment(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  getPaymentDetail(paymentId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getPaymentDetail(
      token,
      paymentId,
      function resSuccess(data) {
        successTrigger(data.payment_mode);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  updatePayment(paymentId, name, arabic_name, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    let params = {
      name,
      arabic_name
    };
    ApiManager.getInstance().updatePayment(
      token,
      paymentId,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  removePayment(paymentId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removePayment(
      token,
      paymentId,
      function resSuccess(data) {
        UserModel.getInstance().PaymentList.forEach((payment, index) => {
          if (payment.id === paymentId) {
            UserModel.getInstance().PaymentList.splice(index, 1);
            successTrigger(data);
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  paymentActivation(paymentId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().paymentActivation(
      token,
      paymentId,
      params,
      function resSuccess(data) {
        UserModel.getInstance().PaymentList.forEach(payment => {
          if (payment.id === paymentId) {
            payment.is_active = params.is_active;
            successTrigger(data);
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  // start category
  getCategory(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getCategory(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  searchCategory(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().searchCategory(
      token,
      params,
      function resSuccess(data) {
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  catExist(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().catExist(
      token,
      params,
      function resSuccess(data) {
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getCategoryDetail(categoryId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getCategoryDetail(
      token,
      categoryId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  removeCategory(categoryId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeCategory(
      token,
      categoryId,
      function resSuccess(data) {
        UserModel.getInstance().CategoryList.forEach((category, index) => {
          if (category.id === categoryId) {
            UserModel.getInstance().CategoryList.splice(index, 1);
            successTrigger(data);
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  addCategory(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addCategory(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  updateCategory(categoryId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().updateCategory(
      token,
      categoryId,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  //end category

  removeSubCategory(categoryId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.id = categoryId;
    ApiManager.getInstance().removeCategory(
      token,
      params,
      function resSuccess(data) {
        UserModel.getInstance().subCategoryList.forEach((category, index) => {
          if (category.id === categoryId) {
            UserModel.getInstance().subCategoryList.splice(index, 1);
            successTrigger(data);
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getSubCategory(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getSubCategory(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  searchSubCategory(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().searchSubCategory(
      token,
      params,
      function resSuccess(data) {
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  addSubCategory(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addSubCategory(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  //Start Merchant group
  getMerchantGroup(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getMerchantGroup(
      token,
      params,
      function resSuccess(data) {
        UserModel.getInstance().MerchantGroupList = data.merchant_groups.data;
        successTrigger(data.merchant_groups);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  getMerchantGroupDetail(merchantGroupId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getMerchantGroupDetail(
      token,
      merchantGroupId,
      function resSuccess(data) {
        successTrigger(data.merchant_group);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  removeMerchantGroup(merchantGroupId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeMerchantGroup(
      token,
      merchantGroupId,
      function resSuccess(data) {
        UserModel.getInstance().MerchantGroupList.forEach(
          (merchantGroup, index) => {
            if (merchantGroup.id === merchantGroupId) {
              UserModel.getInstance().MerchantGroupList.splice(index, 1);
              successTrigger(data);
            }
          }
        );
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  addMerchantGroup(name, arabicName, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addMerchantGroup(
      token,
      name,
      arabicName,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }
  updateMerchantGroup(
    merchantGroupId,
    name,
    arabicName,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.name = name;
    params.arabic_name = arabicName;
    ApiManager.getInstance().updateMerchantGroup(
      token,
      merchantGroupId,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  merchantGroupActivation(
    merchantGroupId,
    params,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().merchantGroupActivation(
      token,
      merchantGroupId,
      params,
      function resSuccess(data) {
        UserModel.getInstance().MerchantGroupList.forEach(merchantGroup => {
          if (merchantGroup.id === merchantGroupId) {
            merchantGroup.is_active = params.is_active;
            successTrigger(data);
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  //Start Merchant Tag
  getMerchantTag(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getMerchantTag(
      token,
      params,
      function resSuccess(data) {
        UserModel.getInstance().MerchantTagList = data.merchant_tags.data;
        successTrigger(data.merchant_tags);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  getMerchantTagDetail(merchantTagId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getMerchantTagDetail(
      token,
      merchantTagId,
      function resSuccess(data) {
        successTrigger(data.merchant_tag);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  removeMerchantTag(merchantTagId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeMerchantTag(
      token,
      merchantTagId,
      function resSuccess(data) {
        UserModel.getInstance().MerchantTagList.forEach(
          (merchantTag, index) => {
            if (merchantTag.id === merchantTagId) {
              UserModel.getInstance().MerchantTagList.splice(index, 1);
              successTrigger(data);
            }
          }
        );
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  addMerchantTag(
    name,
    arb_name,
    backColor,
    priority,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.name = name;
    params.arabic_name = arb_name;
    params.color = backColor;
    params.rank = priority;
    ApiManager.getInstance().addMerchantTag(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }
  updateMerchantTag(
    merchantTagId,
    name,
    arb_name,
    backColor,
    priority,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.name = name;
    params.arabic_name = arb_name;
    params.color = backColor;
    params.rank = priority;
    ApiManager.getInstance().updateMerchantTag(
      token,
      merchantTagId,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  merchantTagActivation(merchantTagId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().merchantTagActivation(
      token,
      merchantTagId,
      params,
      function resSuccess(data) {
        UserModel.getInstance().MerchantTagList.forEach(
          (merchantTag, index) => {
            if (merchantTag.id === merchantTagId) {
              merchantTag.is_active = params.is_active;
              successTrigger(data);
            }
          }
        );
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  activateMerchantTag(merchantTagId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.id = merchantTagId;
    ApiManager.getInstance().activateMerchantTag(
      token,
      params,
      function resSuccess(data) {
        UserModel.getInstance().MerchantTagList.forEach(
          (merchantTag, index) => {
            if (merchantTag.id === merchantTagId) {
              merchantTag.is_active = true;
              successTrigger(data);
            }
          }
        );
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  deactivateMerchantTag(merchantTagId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.id = merchantTagId;
    ApiManager.getInstance().deactivateMerchantTag(
      token,
      params,
      function resSuccess(data) {
        UserModel.getInstance().MerchantTagList.forEach(
          (merchantTag, index) => {
            if (merchantTag.id === merchantTagId) {
              merchantTag.is_active = false;
              successTrigger(data);
            }
          }
        );
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  //Start Merchant Info Tag
  getMerchantInfoTag(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getMerchantInfoTag(
      token,
      params,
      function resSuccess(data) {
        UserModel.getInstance().MerchantInfoTagList = data.infoTags.data;
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  getMerchantInfoTagDetail(merchantInfoTagId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getMerchantInfoTagDetail(
      token,
      merchantInfoTagId,
      function resSuccess(data) {
        successTrigger(data.infoTag);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  removeMerchantInfoTag(merchantInfoTagId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeMerchantInfoTag(
      token,
      merchantInfoTagId,
      function resSuccess(data) {
        UserModel.getInstance().MerchantInfoTagList.forEach(
          (merchantInfoTag, index) => {
            if (merchantInfoTag.id === merchantInfoTagId) {
              UserModel.getInstance().MerchantInfoTagList.splice(index, 1);
              successTrigger(data);
            }
          }
        );
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  addMerchantInfoTag(name, arb_name, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addMerchantInfoTag(
      token,
      name,
      arb_name,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  addMerchantInfoTagMedia(params, id, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addMerchantInfoTagMedia(
      token,
      id,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }
  updateMerchantInfoTag(
    merchantTagId,
    name,
    arb_name,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    var params = {};
    params.name = name;
    params.arabic_name = arb_name;
    ApiManager.getInstance().updateMerchantInfoTag(
      token,
      merchantTagId,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }
  merchantInfoTagActivation(
    merchantInfoTagId,
    params,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().merchantInfoTagActivation(
      token,
      merchantInfoTagId,
      params,
      function resSuccess(data) {
        UserModel.getInstance().MerchantInfoTagList.forEach(
          (merchantInfoTag, index) => {
            if (merchantInfoTag.id === merchantInfoTagId) {
              merchantInfoTag.is_active = params.is_active;
              successTrigger(data);
            }
          }
        );
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  // Start Area

  getArea(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getArea(
      token,
      params,
      function resSuccess(data) {
        UserModel.getInstance().AreaList = data.areas;
        successTrigger(data.areas);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  getCityArea(cityId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getCityArea(
      token,
      cityId,
      function resSuccess(data) {
        UserModel.getInstance().CityAreaList = data.areas;
        successTrigger(data.areas);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getAreaDetail(areaId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getAreaDetail(
      token,
      areaId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  addArea(
    name,
    arabic_name,
    provinceId,
    countryId,
    cityId,
    lat,
    lng,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.name = name;
    params.arabic_name = arabic_name;
    params.country_id = countryId;
    params.province_id = provinceId;
    params.city_id = cityId;
    params.lat = lat;
    params.lng = lng;

    ApiManager.getInstance().addArea(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  removeArea(areaId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeArea(
      token,
      areaId,
      function resSuccess(data) {
        UserModel.getInstance().AreaList.forEach((area, index) => {
          if (area.id === areaId) {
            UserModel.getInstance().AreaList.splice(index, 1);
            successTrigger(data);
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  updateArea(
    areaId,
    name,
    arabic_name,
    provinceId,
    countryId,
    cityId,
    lat,
    lng,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.name = name;
    params.arabic_name = arabic_name;
    params.country_id = countryId;
    params.province_id = provinceId;
    params.city_id = cityId;
    params.lat = lat;
    params.lng = lng;

    ApiManager.getInstance().updateArea(
      token,
      params,
      areaId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  areaActivation(areaId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().areaActivation(
      token,
      params,
      areaId,
      function resSuccess(data) {
        UserModel.getInstance().AreaList.forEach((area, index) => {
          if (area.id === areaId) {
            area.is_active = params.is_active;
            successTrigger(data);
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  // start Landmark
  getLandmark(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getLandmark(
      token,
      params,
      function resSuccess(data) {
        UserModel.getInstance().LandmarkList = data.landmarks.data;
        successTrigger(data.landmarks);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getAreaLandmark(areaId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();

    ApiManager.getInstance().getAreaLandmark(
      token,
      areaId,
      function resSuccess(data) {
        successTrigger(data.landmark);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getLandmarkTypes(successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getLandmarkTypes(
      token,
      function resSuccess(data) {
        UserModel.getInstance().LandmarkTypeList = data;
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getLandmarkDetail(landmarkId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getLandmarkDetail(
      token,
      landmarkId,
      function resSuccess(data) {
        successTrigger(data.landmark);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  addLandmark(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();

    ApiManager.getInstance().addLandmark(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  removeLandmark(landmarkId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeLandmark(
      token,
      landmarkId,
      function resSuccess(data) {
        UserModel.getInstance().LandmarkList.forEach((landmark, index) => {
          if (landmark.id === landmarkId) {
            UserModel.getInstance().LandmarkList.splice(index, 1);
            successTrigger(data);
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  updateLandmark(landmarkId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().updateLandmark(
      token,
      landmarkId,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  landmarkActivation(landmarkId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().landmarkActivation(
      token,
      landmarkId,
      params,
      function resSuccess(data) {
        UserModel.getInstance().LandmarkList.forEach((landmark, index) => {
          if (landmark.id === landmarkId) {
            landmark.is_active = params.is_active;
            successTrigger(data);
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  // get goe
  getCountries(successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();

    ApiManager.getInstance().getCountries(
      token,
      function resSuccess(countries) {
        UserModel.getInstance().CountriesList = countries.countries;
        successTrigger();
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getCuisine(successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();

    ApiManager.getInstance().getCuisine(
      token,
      function resSuccess(data) {
        UserModel.getInstance().CuisinesList = data;
        successTrigger();
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getProvince(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();

    ApiManager.getInstance().getProvince(
      token,
      params,
      function resSuccess(provinces) {
        UserModel.getInstance().ProvinceList = provinces.provinces;
        successTrigger();
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  getProvinceDetail(provinceId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();

    ApiManager.getInstance().getProvinceDetail(
      token,
      provinceId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  addProvince(name, arabic_name, countryId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.name = name;
    params.arabic_name = arabic_name;
    params.country_id = countryId;
    ApiManager.getInstance().addProvince(
      token,
      params,
      function resSuccess() {
        successTrigger();
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }
  updateProvince(
    provinceId,
    name,
    arabic_name,
    countryId,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.name = name;
    params.arabic_name = arabic_name;
    params.country_id = countryId;
    ApiManager.getInstance().updateProvince(
      token,
      provinceId,
      params,
      function resSuccess() {
        successTrigger();
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  removeProvince(provinceId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeProvince(
      token,
      provinceId,
      function resSuccess() {
        UserModel.getInstance().ProvinceList.forEach((province, index) => {
          if (province.id === provinceId) {
            UserModel.getInstance().ProvinceList.splice(index, 1);
            successTrigger();
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  provinceActivation(provinceId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().provinceActivation(
      token,
      provinceId,
      params,
      function resSuccess(data) {
        UserModel.getInstance().ProvinceList.forEach((province, index) => {
          if (province.id === provinceId) {
            province.is_active = params.is_active;
            successTrigger(data);
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getCities(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();

    ApiManager.getInstance().getCities(
      token,
      params,
      function resSuccess(cities) {
        UserModel.getInstance().CitiesList = cities.cities;
        successTrigger();
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  addCity(
    name,
    arabic_name,
    countryId,
    provinceId,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.name = name;
    params.arabic_name = arabic_name;
    params.country_id = countryId;
    params.province_id = provinceId;
    ApiManager.getInstance().addCity(
      token,
      params,
      function resSuccess() {
        successTrigger();
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getCityDetail(cityId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();

    ApiManager.getInstance().getCityDetail(
      token,
      cityId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  updateCity(
    cityId,
    name,
    arabic_name,
    countryId,
    provinceId,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.name = name;
    params.arabic_name = arabic_name;
    params.country_id = countryId;
    params.province_id = provinceId;
    ApiManager.getInstance().updateCity(
      token,
      cityId,
      params,
      function resSuccess() {
        successTrigger();
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  removeCity(cityId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeCity(
      token,
      cityId,
      function resSuccess() {
        UserModel.getInstance().CitiesList.forEach((city, index) => {
          if (city.id === cityId) {
            UserModel.getInstance().CitiesList.splice(index, 1);
            successTrigger();
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  cityActivation(cityId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().cityActivation(
      token,
      cityId,
      params,
      function resSuccess(data) {
        UserModel.getInstance().CitiesList.forEach((city, index) => {
          if (city.id === cityId) {
            city.is_active = params.is_active;
            successTrigger(data);
          }
        });
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  addMedia(image, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    let params = new FormData();
    params.append('image', image);
    ApiManager.getInstance().addMedia(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data.file);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  removeMedia(image, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    let params = {};
    params.key = image;
    ApiManager.getInstance().removeMedia(
      token,
      params,
      function resSuccess() {
        successTrigger();
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  // order





  searchOrderLog(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().searchOrderLog(
      token,
      params,
      function resSuccess(data) {
        UserModel.getInstance().OrderLogList = data.orders.data;
        successTrigger(data);
      },

      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  checkNewOrders(successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().checkNewOrders(
      token,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  removeOrder(userId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeOrder(
      token,
      userId,
      function resSuccess() {
        UserModel.getInstance().UserList.forEach((user, index) => {
          if (user.id === userId) {
            UserModel.getInstance().UserList.splice(index, 1);
            successTrigger();
          }
        });
        successTrigger();
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  getOutletUser(successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getOutletUser(
      token,
      function resSuccess(data) {
        UserModel.getInstance().OutletUserList = data;
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  // forgort password

  resetusername(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().resetusername(
      token,
      params,
      function resSuccess(data) {
        // UserModel.getInstance().saveToken(user.token, user.user_role_id);
        successTrigger(data);
      },
      function resFailed(msg) {
        console.log(msg);
        failureTrigger(msg);
      }
    );
  }

  resetCode(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().resetCode(
      token,
      params,
      function resSuccess(data) {
        // UserModel.getInstance().saveToken(user.token, user.user_role_id);
        successTrigger(data);
      },
      function resFailed(msg) {
        console.log(msg);
        failureTrigger(msg);
      }
    );
  }

  updatePassword(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().updatePassword(
      token,
      params,
      function resSuccess(data) {
        // UserModel.getInstance().saveToken(user.token, user.user_role_id);
        successTrigger(data);
      },
      function resFailed(msg) {
        console.log(msg);
        failureTrigger(msg);
      }
    );
  }

  // manual order pickup
  manualOrder(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().manualOrder(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  uploadImage(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    console.log('para image', params);
    ApiManager.getInstance().uploadImage(
      token,
      params,
      function resSuccess(data) {
        console.log('succ', data);
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }

  // vehicels
  getVehicles(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getVehicles(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  removeVehicle(vehicleId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeVehicle(
      token,
      vehicleId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  addVehicle(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addVehicle(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        console.log(msg);
        failureTrigger(msg);
      }
    );
  }

  getEditVehicle(vehicleId, successTrigger, failureTrigger) {
    console.log('vehicle ud ', vehicleId);
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getEditVehicle(
      token,
      vehicleId,
      function resSuccess(data) {
        // UserModel.getInstance().productList = data.categories.data
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  // Drivers

  addDriver(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addDriver(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        console.log(msg);
        failureTrigger(msg);
      }
    );
  }

  removeDriver(driverId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeDriver(
      token,
      driverId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getSingleDriver(driverId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getSingleDriver(
      token,
      driverId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  updateDriver(driverId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().updateDriver(
      token,
      driverId,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }
  getDriver(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    console.log('params driver', params);
    ApiManager.getInstance().getDriver(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  searchDriver(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    console.log('params driver', params);
    ApiManager.getInstance().searchDriver(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  //Routes
  addRoute(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addRoute(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getRoute(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getRoute(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getRouteDetails(params, id, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getRouteDetails(
      token,
      null,
      id,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  deleteRoute(id, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().deleteRoute(
      token,
      id,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  //Deals
  addDeal(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addDeal(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  removeDeal(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeDeal(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getDeal(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getDeal(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getDealDetail(params, id, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getDealDetail(
      token,
      params,
      id,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  searchDeal(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().searchDeal(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  dealCheckSku(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().dealCheckSku(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  // Banners
  addBanner(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addBanner(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        console.log(msg);
        failureTrigger(msg);
      }
    );
  }

  removeBanner(BannerId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeBanner(
      token,
      BannerId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getSingleBanner(BannerId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getSingleBanner(
      token,
      BannerId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  updateBanner(BannerId, params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().updateBanner(
      token,
      BannerId,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getBanner(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    console.log('params Banner', params);
    ApiManager.getInstance().getBanner(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getBanner(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    console.log('params Banner', params);
    ApiManager.getInstance().getBanner(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  // Broadcast Messages
  removeBroadcastMessage(BroadcastMessageId, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().removeBroadcastMessage(
      token,
      BroadcastMessageId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getSingleBroadcastMessage(
    BroadcastMessageId,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getSingleBroadcastMessage(
      token,
      BroadcastMessageId,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  updateBroadcastMessage(
    BroadcastMessageId,
    params,
    successTrigger,
    failureTrigger
  ) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().updateBroadcastMessage(
      token,
      BroadcastMessageId,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  getBroadcastMessages(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    console.log('params BroadcastMessages', params);
    ApiManager.getInstance().getBroadcastMessages(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }

  addBroadcastMessage(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().addBroadcastMessage(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        console.log(msg);
        failureTrigger(msg);
      }
    );
  }

  getCities(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    console.log('params Cities', params);
    ApiManager.getInstance().getCities(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        failureTrigger(msg);
      }
    );
  }


  // Users 
    //User section start
    addUser(params, successTrigger, failureTrigger) {
      let token = UserModel.getInstance().getToken();
      ApiManager.getInstance().addUser(
        token,
        params,
        function resSuccess(data) {
          successTrigger(data);
        },
        function resFailed(msg) {
          console.log(msg);
          failureTrigger(msg);
        }
      );
    }
  
    getUserDetails(userId, successTrigger, failureTrigger) {
      let token = UserModel.getInstance().getToken();
      ApiManager.getInstance().getUserDetails(
        token,
        userId,
        function resSuccess(data) {
          successTrigger(data);
        },
        function resFailed(error) {
          failureTrigger(error);
        }
      );
    }
  
    updateUser(userid, params, successTrigger, failureTrigger) {
      let token = UserModel.getInstance().getToken();
      ApiManager.getInstance().updateUser(
        token,
        userid,
        params,
        function resSuccess(data) {
          successTrigger(data);
        },
        function resFailed(error) {
          failureTrigger(error);
        }
      );
    }
  
    getUsersList(params, successTrigger, failureTrigger) {
      let token = UserModel.getInstance().getToken();
      ApiManager.getInstance().getUsersList(
        token,
        params,
        function resSuccess(data) {
          successTrigger(data);
        },
        function resFailed(msg) {
          failureTrigger(msg);
        }
      );
    }
  
    userActivation(userId, params, successTrigger, failureTrigger) {
      let token = UserModel.getInstance().getToken();
      ApiManager.getInstance().userActivation(
        token,
        userId,
        params,
        function resSuccess(data) {
          UserModel.getInstance().UserList.forEach((user, index) => {
            if (user.id === userId) {
              user.is_active = params.is_active;
              successTrigger(data);
            }
          });
        },
        function resFailed(msg) {
          failureTrigger(msg);
        }
      );
    }
  
    downloadUsers(params, successTrigger, failureTrigger) {
      let token = UserModel.getInstance().getToken();
      ApiManager.getInstance().downloadUsers(
        token,
        params,
        function resSuccess(data) {
          successTrigger(data);
        },
        function resFailed(msg) {
          failureTrigger(msg);
        }
      );
    }
  
    searchUsersList(params, successTrigger, failureTrigger) {
      let token = UserModel.getInstance().getToken();
      ApiManager.getInstance().searchUsersList(
        token,
        params,
        function resSuccess(data) {
          successTrigger(data);
        },
        function resFailed(msg) {
          failureTrigger(msg);
        }
      );
    }
  
    removeUser(userId, successTrigger, failureTrigger) {
      let token = UserModel.getInstance().getToken();
      ApiManager.getInstance().removeUser(
        token,
        userId,
        function resSuccess() {
          UserModel.getInstance().UserList.forEach((user, index) => {
            if (user.id === userId) {
              UserModel.getInstance().UserList.splice(index, 1);
              successTrigger();
            }
          });
          successTrigger();
        },
        function resFailed(error) {
          failureTrigger(error);
        }
      );
    }
    
    globalSearchUsers(params, paramObj, successTrigger, failureTrigger) {
      let token = UserModel.getInstance().getToken();
      console.log('param usermodel', params);
      ApiManager.getInstance().globalSearchUsers(
        token,
        params,
        paramObj,
        function resSuccess(data) {
          console.log({ data });
          // UserModel.getInstance().productList = data.categories.data
          successTrigger(data);
        },
        function resFailed(msg) {
          failureTrigger(msg);
        }
      );
    }



}
