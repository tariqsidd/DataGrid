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


  getUserProfile(token, params, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL + 'user/profile',
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

  
  getFutureDatesOfDelivery(token, cityid, successCallback, failureCallback) {
    NetworkManger.getInstance().getNetworkRequest(
      CONSTANT.baseURL.replace('sales/', '') + 'setting/calendar/' + cityid,
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


}
