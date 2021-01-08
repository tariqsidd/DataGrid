import NetworkManger from './NetworkHandler';
// import CONSTANT from '../../Constants/api';
import CONSTANT from '../../constants';

export default class Api {
  static myInstance = null;
  static getInstance() {
    if (Api.myInstance === null) {
      Api.myInstance = new Api();
    }
    return this.myInstance;
  }

  Login(username, password, successCallback, failureCallback) {
    var params = {};
    params.mobile = username;
    params.password = password;

    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'user/login',
      null,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(text) {
        failureCallback(text);
      }
    );
  }


  // Manual Orders
  getUsersListFromMobile(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'search/retailer',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getSkuByName(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'search/sku',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  postManualOrder(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'order',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getOrderLog(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'order',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  downloadOrderDetails(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'order/download',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  globalSearchOrder(token, params, paramObj, successCallback, failureCallback) {
    // console.log('params', params);
    let searchParamsURL = '';
    params &&
      params.length > 0 &&
      Array.isArray(params) &&
      params.forEach((item, index) => {
        // console.log(index, item);
        searchParamsURL +=
          `${item.column_name}=${item.text}` +
          (params.length - 1 == index ? '' : '&');
      });
    // console.log('searchParamURL', searchParamsURL);
    NetworkManger.getInstance().getSearchNetworkRequest(
      CONSTANT.baseURL + `order/search?orders.${searchParamsURL}`,
      token,
      paramObj,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getOrderDetail(token, orderDetailId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'order/' + orderDetailId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addOrderDetail(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().patchNetworkRequest(
      CONSTANT.baseURL + 'order/sku',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeOrderDetail(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().patchNetworkRequest(
      CONSTANT.baseURL + 'order/sku',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateOrderStatus(token, order_id, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'order/' + order_id,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }




  // Sku Requests
  getSkuRequests(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getSkuNetworkRequest(
      CONSTANT.baseURL + 'requests',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Start user section
  addRetailer(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'retailer',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(text) {
        failureCallback(text);
      }
    );
  }

  getRetailerDetails(token, retailerId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'retailer/' + retailerId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateRetailer(token, retailerId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'retailer/' + retailerId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeRetailer(token, retailerId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'retailer/' + retailerId,
      token,
      retailerId,
      function reqSuccess() {
        successCallback();
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getRetailersList(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'retailer',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  retailerChangePassword(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'user/reset-password',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  globalSearchRetailer(
    token,
    params,
    paramObj,
    successCallback,
    failureCallback
  ) {
    // console.log('params', params);
    let searchParamsURL = '';
    params &&
      params.length > 0 &&
      Array.isArray(params) &&
      params.forEach((item, index) => {
        // console.log(index, item);
        searchParamsURL +=
          `${item.column_name}=${item.text}` +
          (params.length - 1 == index ? '' : '&');
      });
    // console.log('searchParamURL');
    NetworkManger.getInstance().getSearchNetworkRequest(
      CONSTANT.baseURL + `retailer/search?users.${searchParamsURL}`,
      token,
      paramObj,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  retailerActivation(
    token,
    retailerId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'retailer/active/' + retailerId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // userDeactivation(token, userId, params, successCallback, failureCallback) {
  //   NetworkManger.getInstance().updateNetworkRequest(CONSTANT.baseURL + "user/active/" + userId, token, params,
  //     function reqSuccess(data) {
  //       successCallback(data)
  //     },
  //     function reqFailed(error) {
  //       failureCallback(error)
  //     }
  //   )
  // }

  downloadRetailers(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getDownloadUrl(
      CONSTANT.baseURL + 'user/download',
      token,
      params,
      'Users ' + params.from + ' to ' + params.to,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchRetailersList(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'retailer/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  //End user section

  programAssociation(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'user/program',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  //Product section
  getProduct(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'product',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  //Product section
  getEditProduct(token, product_id, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'product/' + product_id,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  productExist(token, params, successCallback, failureCallback) {
    // console.log('params', params);
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + `product/check-availability?name=${params}`,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  globalSearchProduct(
    token,
    params,
    paramObj,
    successCallback,
    failureCallback
  ) {
    // console.log('params', params);
    NetworkManger.getInstance().getSearchNetworkRequest(
      CONSTANT.baseURL +
      `product/search?${params.column_name}.name=` +
      params.text,
      token,
      paramObj,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  globalSearchProductSku(
    token,
    params,
    paramObj,
    successCallback,
    failureCallback
  ) {
    // console.log('params', params);
    let searchParamsURL = '';
    params &&
      params.length > 0 &&
      Array.isArray(params) &&
      params.forEach((item, index) => {
        // console.log(index, item);
        searchParamsURL +=
          `${item.column_name}=${item.text}` +
          (params.length - 1 == index ? '' : '&');
      });
    // console.log('searchParamURL');
    NetworkManger.getInstance().getSearchNetworkRequest(
      CONSTANT.baseURL + `product/sku/search?${searchParamsURL}`,
      token,
      paramObj,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  searchProduct(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'product/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getProductDetail(token, productId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'product/' + productId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addProduct(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'product/',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateProduct(token, product, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'product/' + product,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeProduct(token, id, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'product/' + id,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }
  //End product section

  //Start of Sku section
  getSku(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'product/sku',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  downloadSku(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'product/sku/download',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getAggregateSku(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'order/sku',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getAllSkuData(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'order/sku/download',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getSingleSku(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getSkuNetworkRequest(
      CONSTANT.baseURL + 'product/sku/',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getSkuDetail(token, sku, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'sku/' + sku,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addSku(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'product/sku/',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateSku(token, sku, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'product/sku/' + sku,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeSku(token, id, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'product/sku/' + id,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  searchSku(token, name, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'product/sku/search',
      token,
      name,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  //End of Sku section

  //Start supplier section
  getSupplier(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'supplier',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchSupplier(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'supplier/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  //End supplier section

  //Start of brand section
  getBrand(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + '/brand',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  brandExist(token, params, successCallback, failureCallback) {
    // console.log('params', params);
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + `brand/check-availability?name=${params}`,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getBrandDetail(token, brand_ID, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'brand/' + brand_ID,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  addBrand(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'brand',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateBrand(token, brand_ID, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'brand/' + brand_ID,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchBrand(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + '/brand/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  //End of brand section

  getPayment(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'payment_mode',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addPayment(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'payment_mode',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getPaymentDetail(token, paymentId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'payment_mode/' + paymentId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updatePayment(token, paymentId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'payment_mode/' + paymentId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  paymentActivation(
    token,
    paymentId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'payment_mode/active/' + paymentId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removePayment(token, paymentId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'payment_mode/' + paymentId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  // Start Category
  getCategory(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'category',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchCategory(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'category/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getCategoryDetail(token, categoryId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'category/' + categoryId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addCategory(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'category',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateCategory(token, categoryId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'category/' + categoryId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeCategory(token, id, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'category/' + id,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  catExist(token, params, successCallback, failureCallback) {
    // console.log('params', params);
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL +
      `category/check-availability?${params.field}=${params.text}`,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // end Category

  getSubCategory(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'category/sub',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchSubCategory(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'category/' + params + '/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addSubCategory(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'category',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateSubCategory(
    token,
    name,
    arabicName,
    description,
    arabicDescription,
    backColor,
    categoryId,
    logoImage,
    bannerImage,
    successCallback,
    failureCallback
  ) {
    var params = new FormData();
    params.append('name', name);
    if (arabicName.length > 0) {
      params.append('arabic_name', arabicName);
    }
    if (arabicDescription.length > 0) {
      params.append('arabic_description', arabicDescription);
    }
    params.append('description', description);
    params.append('color', backColor);
    params.append('parent_id', categoryId);
    if (logoImage) {
      params.append('icon', logoImage);
    }
    if (bannerImage) {
      params.append('background', bannerImage);
    }

    NetworkManger.getInstance().postFormRequest(
      CONSTANT.baseURL + 'merchant_category/add',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Start Merhant Tag
  getMerchantTag(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'merchant/tag',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  getMerchantTagDetail(token, merchantTagId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'merchant/tag/' + merchantTagId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeMerchantTag(token, merchantTagId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'merchant/tag/' + merchantTagId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addMerchantTag(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'merchant/tag',
      token,
      params,
      function reqFailed(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  updateMerchantTag(
    token,
    merchantTagId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'merchant/tag/' + merchantTagId,
      token,
      params,
      function reqFailed(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  merchantTagActivation(
    token,
    merchantTagId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'merchant/tag/active/' + merchantTagId,
      token,
      params,
      function reqFailed(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Start Merhant Group
  getMerchantGroup(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'merchant/group',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  getMerchantGroupDetail(
    token,
    merchantGroupId,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'merchant/group/' + merchantGroupId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeMerchantGroup(
    token,
    merchantGroupId,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'merchant/group/' + merchantGroupId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addMerchantGroup(token, name, arabicName, successCallback, failureCallback) {
    let params = {};
    params.name = name;
    if (arabicName.length > 0) {
      params.arabic_name = arabicName;
    }

    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'merchant/group',
      token,
      params,
      function reqFailed(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  updateMerchantGroup(
    token,
    merchantGroupId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'merchant/group/' + merchantGroupId,
      token,
      params,
      function reqFailed(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  merchantGroupActivation(
    token,
    merchantGroupId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'merchant/group/active/' + merchantGroupId,
      token,
      params,
      function reqFailed(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  // Start Merhant Info Tag
  getMerchantInfoTag(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'info-tag',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  getMerchantInfoTagDetail(
    token,
    merchantInfoTagId,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'info-tag/' + merchantInfoTagId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeMerchantInfoTag(
    token,
    merchantInfoTagId,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'info-tag/' + merchantInfoTagId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addMerchantInfoTagMedia(token, id, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postFormRequest(
      CONSTANT.baseURL + 'info-tag/upload/' + id,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addMerchantInfoTag(token, name, arb_name, successCallback, failureCallback) {
    var params = {};
    params.name = name;
    params.arabic_name = arb_name;

    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'info-tag',
      token,
      params,
      function reqFailed(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  updateMerchantInfoTag(
    token,
    merchantTagId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'info-tag/' + merchantTagId,
      token,
      params,
      function reqFailed(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  merchantInfoTagActivation(
    token,
    merchantTagId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'info-tag/active/' + merchantTagId,
      token,
      params,
      function reqFailed(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Start Area

  getArea(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'location/area',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  getCityArea(token, cityId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'area/city/' + cityId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }
  getAreaDetail(token, areaId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'location/area/' + areaId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addArea(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'location/area',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  updateArea(token, params, id, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'location/area/' + id,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  areaActivation(token, params, id, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'location/area/active/' + id,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  removeArea(token, id, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'location/area/' + id,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Start Landmark

  getLandmark(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'location/landmark',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  getAreaLandmark(token, areaId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'landmark/area/' + areaId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  getLandmarkTypes(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'location/landmark/type',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  getLandmarkDetail(token, landmarkId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'location/landmark/' + landmarkId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addLandmark(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'location/landmark',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  updateLandmark(token, id, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'location/landmark/' + id,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  landmarkActivation(token, id, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'location/landmark/active/' + id,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeLandmark(token, landmarkId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'location/landmark/' + landmarkId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  //get geo
  getCountries(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'location/country',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getCuisine(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'cuisines',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getCities(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'location/city',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addCity(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'location/city',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getCityDetail(token, cityId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'location/city/' + cityId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateCity(token, cityId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'location/city/' + cityId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  cityActivation(token, cityId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'location/city/active/' + cityId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeCity(token, cityId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'location/city/' + cityId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getProvince(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'location/province',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  getProvinceDetail(token, provinceId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'location/province/' + provinceId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function failure(error) {
        failureCallback(error);
      }
    );
  }

  addProvince(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'location/province',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateProvince(token, provinceId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'location/province/' + provinceId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  provinceActivation(
    token,
    provinceId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'location/province/active/' + provinceId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeProvince(token, provinceId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'location/province/' + provinceId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Merchants

  addMerchant(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'merchant',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateMerchant(token, merchantId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'merchant/' + merchantId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getMerchant(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'merchant',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getSearchMerchant(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'merchant/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getMerchantDetail(token, merchantId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'merchant/' + merchantId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getMerchantOutlet(token, merchantId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'outlet/merchant/' + merchantId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeMerchant(token, merchantId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'merchant/' + merchantId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  merchantActivation(
    token,
    merchantId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'merchant/active/' + merchantId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // deactivateMerchant(token, params, successCallback, failureCallback) {
  //   NetworkManger.getInstance().postNetworkRequest(CONSTANT.baseURL + "merchant/deactivate", token, params,
  //     function reqSuccess(data) {
  //       successCallback(data)
  //     },
  //     function reqFailed(error) {
  //       failureCallback(error)
  //     }
  //   )
  // }

  getMerchantType(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'merchant/type',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function failure(error) {
        failureCallback(error);
      }
    );
  }

  // Collection

  getCollection(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'collection',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function failure(error) {
        failureCallback(error);
      }
    );
  }
  addCollection(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'collection',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  getCollectionDetail(token, collectionId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'collection/' + collectionId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(msg) {
        failureCallback(msg);
      }
    );
  }

  updateCollection(
    token,
    params,
    collectionId,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'collection/' + collectionId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  collectionActivation(
    token,
    params,
    collectionId,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'collection/active/' + collectionId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  removeCollection(token, id, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'collection/' + id,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  associateCollection(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'collection/associate',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        // console.log(error);
      }
    );
  }

  addMedia(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postFormRequest(
      CONSTANT.sharedURL + 'media',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeMedia(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.sharedURL + 'media/remove',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Outlet

  getOutlet(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'outlet',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getSearchOutlet(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'outlet/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addOutlet(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'outlet',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getOutletDetail(token, outletId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'outlet/' + outletId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateOutlet(token, outletId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'outlet/' + outletId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  outletActivation(token, outletId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'outlet/active/' + outletId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  sendMerchantPin(token, outletId, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'outlet/forget/' + outletId,
      token,
      {},
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeOutlet(token, outletId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'outlet/' + outletId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getOutletOffers(token, outletId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'outlet/offers/' + outletId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // partner

  getPartner(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'partner',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addPartner(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'partner',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getPartnerDetail(token, partnerId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'partner/' + partnerId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updatePartner(token, params, id, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'partner/' + id,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  partnerActivation(token, params, id, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'partner/active/' + id,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removePartner(token, id, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'partner/' + id,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Program

  getProgram(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'program',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchProgram(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'program/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addProgram(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'program',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getPartnerCities(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'partner/city',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getProgramDetail(token, programId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'program/' + programId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  setDefaultProgram(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'program/default',
      token,
      params,
      function reqSuccess() {
        successCallback();
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateProgram(token, programId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'program/' + programId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  programActivation(
    token,
    programId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'program/active/' + programId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeProgram(token, id, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'program/' + id,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getProgramType(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'program/type',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getProgramAssociation(token, programId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'program/get_merchants/' + programId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getMerchantOffer(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'program/get_merchants_offer',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addOfferAssociation(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'program/associate_offers',
      token,
      params,
      function reqSuccess() {
        successCallback();
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getProgramMerchant(token, programId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'merchant/program/' + programId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getOutletProgramMerchant(
    token,
    programId,
    merchantId,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'outlet/program/' + programId + '/' + merchantId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getOfferProgramMerchant(
    token,
    programId,
    outletId,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'outlet/offers/' + programId + '/' + outletId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Offers

  getOffer(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'offer',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getSearchOffer(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'offer/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addOffer(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'offer',
      token,
      params,
      function reqSuccess() {
        successCallback();
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getOfferCriteria(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'offer/criteria',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getOfferDetail(token, offerId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'offer/' + offerId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateOffer(token, offerId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'offer/' + offerId,
      token,
      params,
      function reqSuccess() {
        successCallback();
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  offerActivation(token, offerId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'offer/active/' + offerId,
      token,
      params,
      function reqSuccess() {
        successCallback();
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeOffer(token, offerId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'offer/' + offerId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }
  getOfferType(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'offer/type',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Coupon

  getCoupon(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'coupon',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addCoupon(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'coupon',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateCoupon(token, couponId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'coupon/' + couponId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  couponActivation(token, params, couponId, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'coupon/active/' + couponId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getCouponDetail(token, couponId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'coupon/' + couponId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  checkPrefix(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'coupon/check',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  activateCoupon(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'coupon/activate',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getCodes(token, couponId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'coupon/' + couponId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  deactivateCoupon(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'coupon/deactivate',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchCoupon(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'coupon/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // logs
  getRedemptionLogs(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'logs/redemption',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchLogs(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'logs/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getPaymentLogs(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'logs/payment',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  //payment log activation
  paymentLogActivation(
    token,
    paymentId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'logs/payment/' + paymentId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  downloadLogs(token, params, successCallback, failureCallback) {
    let fileName = `${params.type === 'redemption'
        ? 'Redemption-Logs ' + params.from + ' to ' + params.to
        : params.type === 'payment'
          ? 'Payment-Logs : ' + params.from + ' to ' + params.to
          : params.type === 'merchant'
            ? 'All-Merchants'
            : params.type === 'outlet'
              ? 'All-Outlets'
              : params.type === 'offer'
                ? 'All-Offers'
                : ''
      }.csv`;
    NetworkManger.getInstance().getDownloadUrl(
      CONSTANT.baseURL + 'logs/download',
      token,
      params,
      fileName,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Notifications

  getAllNotifications(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'notification',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addNotification(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'notification',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  sendNotification(token, notificationId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'notification/send/' + notificationId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getNotificationDetail(
    token,
    notificationId,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'notification/' + notificationId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateNotification(
    token,
    notificationId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'notification/' + notificationId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchNotification(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'notification/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Static Pages

  getPages(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'page/get_list',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getPageDetail(token, pageId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'page/get/' + pageId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updatePage(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'page/set',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addMediaInstance(
    token,
    id,
    instance,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().postFormRequest(
      CONSTANT.baseURL + instance + '/upload/' + id,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getAllCurrency(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'currency',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getAllAppIds(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'app',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // outlet type

  getOutletType(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'outlet-type',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Item-Group

  getItemGroup(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'item_group',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchItemGroup(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'item_group/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addItemGroup(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'item_group',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getItemGroupDetail(token, itemGroupId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'item_group/' + itemGroupId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateItemGroup(
    token,
    itemGroupId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'item_group/' + itemGroupId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  itemGroupActivation(
    token,
    itemGroupId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'item_group/active/' + itemGroupId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeItemGroup(token, itemGroupId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'item_group/' + itemGroupId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  // Item

  getItem(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'item',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchItem(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'item/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addItem(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'item',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getItemDetail(token, itemId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'item/' + itemId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateItem(token, itemId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'item/' + itemId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  itemActivation(token, itemId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'item/active/' + itemId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeItem(token, itemId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'item/' + itemId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  // Addon Sets

  getAddonSet(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'addon_set',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchAddonSet(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'addon_set/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addAddonSet(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'addon_set',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getAddonSetDetail(token, addonSetId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'addon_set/' + addonSetId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateAddonSet(token, addonSetId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'addon_set/' + addonSetId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addonSetActivation(
    token,
    addonSetId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'addon_set/active/' + addonSetId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeAddonSet(token, addonSetId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'addon_set/' + addonSetId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  // Addons

  getAddon(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'addon',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchAddon(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'addon/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addAddon(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'addon',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getAddonDetail(token, addonId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'addon/' + addonId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateAddon(token, addonId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'addon/' + addonId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addonActivation(token, addonId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'addon/active/' + addonId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeAddon(token, addonId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'addon/' + addonId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  // item group list according to outlets

  getOutletItemGroup(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'item/outlets',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // addon set list according to outlets

  getOutletAddon(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'addon/outlets',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // item list according to outlets

  getOutletItem(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'item/item-outlet',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // ecommerce offer

  getEcommerceOffer(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'ecommerce_offer',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchEcommerceOffer(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'ecommerce_offer/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addEcommerceOffer(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'ecommerce_offer',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getEcommerceOfferDetail(
    token,
    ecommerceOfferId,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'ecommerce_offer/' + ecommerceOfferId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateEcommerceOffer(
    token,
    ecommerceOfferId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'ecommerce_offer/' + ecommerceOfferId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  ecommerceOfferActivation(
    token,
    ecommerceOfferId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'ecommerce_offer/active/' + ecommerceOfferId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeEcommerceOffer(
    token,
    ecommerceOfferId,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'ecommerce_offer/' + ecommerceOfferId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  // order list





  searchOrderLog(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'order/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }


  // value type

  getValueType(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'value_type',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchValueType(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'value_type/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addValueType(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'value_type',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getValueTypeDetail(token, valueTypeId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'value_type/' + valueTypeId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateValueType(
    token,
    valueTypeId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'value_type/' + valueTypeId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeValueType(token, valueTypeId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'value_type/' + valueTypeId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  getType(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'value_type/types',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getProgramValueType(token, programTypeId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'program/type/' + programTypeId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // card sets

  getCardSet(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'card',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchCardSet(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'card/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  checkNewOrders(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'order/new-orders',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addCardSet(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'card',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getCardSetDetail(token, cardSetId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'card/' + cardSetId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateCardSet(token, cardSetId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'card/' + cardSetId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // sale channel
  getSaleChannel(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'item/sales',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeCardSet(token, cardSetId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'card/' + cardSetId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  cardSetActivation(
    token,
    cardSetId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'card/active/' + cardSetId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // item type
  getItemType(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'item/itemtype',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // cards

  getCard(token, cardSetId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'card/' + cardSetId + '/card',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // outlist for outlet portal
  getOutletUser(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'outlet/user-outlets',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getCardDetail(token, cardSetId, cardId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'card/' + cardSetId + '/' + cardId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateCard(
    token,
    cardSetId,
    cardId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'card/' + cardSetId + cardId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeCard(token, cardSetId, cardId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'card/' + cardSetId + '/' + cardId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  cardActivation(
    token,
    cardSetId,
    cardId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'card' + cardSetId + '/active/' + cardId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // forgot passwords
  resetusername(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'user/forgot',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  resetCode(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'user/reset-code',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updatePassword(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'user/update-password',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // delivery partner
  getDeliveryPartner(token, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'delivery_partner',
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // manual order pickup

  manualOrder(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'order/pickup',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // uploadImage(token, params, successCallback, failureCallback) {
  //   NetworkManger.getInstance().postImageNetworkRequest(
  //     CONSTANT.baseImageURL,
  //     token,
  //     params,
  //     function reqSuccess(data) {
  //       console.log('succ', data);
  //       successCallback(data);
  //     },
  //     function reqFailed(error) {
  //       failureCallback(error);
  //     }
  //   );
  // }

  // vehicles

  getVehicles(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'vehicle/',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeVehicle(token, vehicleId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'vehicle/' + vehicleId,
      token,
      vehicleId,
      function reqSuccess() {
        successCallback();
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addVehicle(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'vehicle',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(text) {
        failureCallback(text);
      }
    );
  }
  getEditVehicle(token, vehicleId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'vehicle/' + vehicleId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  //Drivers

  getDriver(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'driver/',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchDriver(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'driver/search/',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  //Routes
  addRoute(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'route',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getRoute(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'route/',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getRouteDetails(token, params, id, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'route/' + id,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  deleteRoute(token, id, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'route/' + id,
      token,
      {},
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addDriver(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'driver',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(text) {
        failureCallback(text);
      }
    );
  }

  removeDriver(token, id, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'driver/' + id,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  getSingleDriver(token, driverId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'driver/' + driverId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateDriver(token, driverId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'driver/' + driverId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  //Banners
  addBanner(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'banner',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(text) {
        failureCallback(text);
      }
    );
  }

  removeBanner(token, id, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'banner/' + id,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  getBanner(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'banner/',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getSingleBanner(token, BannerId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'banner/' + BannerId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateBanner(token, BannerId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'banner/' + BannerId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  searchDeal(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'deal/search',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  //Deals Section
  getDeal(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'deal',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getDealDetail(token, params, id, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'deal/sku/' + id,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addDeal(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'deal',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeDeal(token, dealId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'deal/' + dealId,
      token,
      dealId,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateDeal(token, dealId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'deal' + dealId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getDealDetail(token, dealId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'deal/sku/' + dealId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  dealCheckSku(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'deal/check',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Broadcast Messages
  removeBroadcastMessage(token, id, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'notification/' + id,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqSuccess(error) {
        failureCallback(error);
      }
    );
  }

  getBroadcastMessages(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'notification/',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getSingleBroadcastMessage(
    token,
    BroadcastMessageId,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'notification/' + BroadcastMessageId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateBroadcastMessage(
    token,
    BroadcastMessageId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'notification/' + BroadcastMessageId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  addBroadcastMessage(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'notification',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(text) {
        failureCallback(text);
      }
    );
  }

  getCities(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'city/',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  // Users
  addUser(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'user',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(text) {
        failureCallback(text);
      }
    );
  }

  getUserDetails(token, userId, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'user/' + userId,
      token,
      null,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  updateUser(token, userId, params, successCallback, failureCallback) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'user/' + userId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  removeUser(token, userId, successCallback, failureCallback) {
    NetworkManger.getInstance().deleteNetworkRequest(
      CONSTANT.baseURL + 'user/' + userId,
      token,
      userId,
      function reqSuccess() {
        successCallback();
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  getUsersList(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getSkuNetworkRequest(
      CONSTANT.baseURL + 'user',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  userActivation(
    token,
    userId,
    params,
    successCallback,
    failureCallback
  ) {
    NetworkManger.getInstance().updateNetworkRequest(
      CONSTANT.baseURL + 'user/active/' + userId,
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }

  globalSearchUsers(
    token,
    params,
    paramObj,
    successCallback,
    failureCallback
  ) {
    // console.log('params', params);
    let searchParamsURL = '';
    params &&
      params.length > 0 &&
      Array.isArray(params) &&
      params.forEach((item, index) => {
        // console.log(index, item);
        searchParamsURL +=
          `${item.column_name}=${item.text}` +
          (params.length - 1 == index ? '' : '&');
      });
    // console.log('searchParamURL');
    NetworkManger.getInstance().getSearchNetworkRequest(
      CONSTANT.baseURL + `user/search?${searchParamsURL}`,
      token,
      paramObj,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }



  postCheckPromoExistAndReturnAmount(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().postNetworkRequest(
      CONSTANT.baseURL + 'order/coupon',
      token,
      params,
      function reqSuccess(data) {
        successCallback(data);
      },
      function reqFailed(error) {
        failureCallback(error);
      }
    );
  }



}
