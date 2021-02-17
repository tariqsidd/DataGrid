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
    localStorage.removeItem('sales-refresh-token');
    localStorage.removeItem('sales-profile');
    window.location.href = '/sign-in';
  }

  getToken() {
    return localStorage.getItem('sales-auth-token');
  }
  saveToken(token, refreshToken) {
    localStorage.setItem('sales-auth-token', token);
    localStorage.setItem('sales-refresh-token', refreshToken);
  }

  getUserRole() {
    return localStorage.getItem('user_role');
  }

  Login(mobile, password, successTrigger, failureTrigger) {
    ApiManager.getInstance().Login(
      mobile,
      password,
      function resSuccess(user) {
        // console.log('user', user);
        UserModel.getInstance().saveToken(user.token, user.refreshToken);
        successTrigger(user);
        UserModel.getInstance().getUserProfile();
      },

      function resFailed(msg) {
        // console.log('Error: ' + msg);
        failureTrigger(msg);
      }
    );
  }

  getUserProfile() {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getUserProfile(
      token,
      null,
      function resSuccess(data) {
        console.log(data);
        localStorage.setItem('sales-profile', JSON.stringify(data))
      },
      function resFailed(msg) {
        console.log(msg);
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
        alert(msg)
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
    // console.log('param usermodel', params);
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



  postCheckPromoExistAndReturnAmount(params, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().postCheckPromoExistAndReturnAmount(
      token,
      params,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(msg) {
        // alert(msg)
        failureTrigger(msg);
      }
    );
  }


  getFutureDatesOfDelivery(cityid, successTrigger, failureTrigger) {
    let token = UserModel.getInstance().getToken();
    ApiManager.getInstance().getFutureDatesOfDelivery(
      token,
      cityid,
      function resSuccess(data) {
        successTrigger(data);
      },
      function resFailed(error) {
        failureTrigger(error);
      }
    );
  }



}
