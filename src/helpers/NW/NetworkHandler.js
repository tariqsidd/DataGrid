import UserModel from '../../models/UserModel';
import CONSTANT from '../../constants';

export default class NetworkHandler {
  static myInstance = null;
  static getInstance() {
    if (NetworkHandler.myInstance === null) {
      NetworkHandler.myInstance = new NetworkHandler();
    }
    return this.myInstance;
  }

  timeout(promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject('Api Taking Too long to respond Please try Again');
      }, 60000);
      promise.then(resolve, reject);
    });
  }

  postRefreshTokenNetworkRequest(callbackFunc, url, serviceParams, successCallback, failureCallback) {
    let _headers = {
      'content-type': 'application/json'
    };
    // console.log(callbackFunc)
    let refreshtoken = localStorage.getItem('sales-refresh-token')
    let refreshTokenUrl = CONSTANT.baseURL + 'user/refreshtoken'
    if (refreshtoken) {
      _headers['Authorization'] = `Bearer ${refreshtoken}`;
    }
    console.log('refreshTokenUrl', refreshTokenUrl);
    NetworkHandler.getInstance()
      .timeout(
        fetch(refreshTokenUrl, {
          method: 'POST',
          headers: _headers,
          // body: JSON.stringify({})
        })
      )
      // .then((response) => {
      //   if (response.status === 401) {
      //     UserModel.getInstance().signOut();
      //   }
      // })
      .then(response => {
        if (response.status === 401) {
          console.log('Arey bhai.. refresh token bhe expire hogyya kya??')
          UserModel.getInstance().signOut();
        }
        return response.json();
      })
      .then(responseJson => {
        // console.log('Responce from server is ', responseJson);
        if (responseJson.status === true) {
          console.log('Success rephresh token');
          // console.log('token', responseJson.data.token)
          // console.log('refreshtoken', responseJson.data.refreshToken)
          let NewToken = responseJson.data.token;
          localStorage.setItem('sales-auth-token', responseJson.data.token)
          localStorage.setItem('sales-refresh-token', responseJson.data.refreshToken)
          // NetworkHandler.getInstance()
          callbackFunc(url, NewToken, serviceParams, successCallback, failureCallback)
        } else {
          // console.log('Failure');
        }
        // if (responseJson.data !== null) {
        //   if (responseJson.status === true){
        //     successCallback(responseJson.data);
        //   }
        //   else {
        //     failureCallback('Error in input params: '+ responseJson.error);
        //   }
        // } else {
        //   console.log('server wala error')
        //     failureCallback('Error from server :'+ responseJson.error);
        // }
      })
      .catch(error => {
        // console.log('Failure', error);
        // failureCallback(error);
      });
  }

  getNetworkRequest(
    url,
    token,
    serviceParams,
    successCallback,
    failureCallback
  ) {
    // console.log('parameters are : ' + JSON.stringify(serviceParams));

    // console.log({ serviceParams });
    if (serviceParams != null && !url.includes('?')) {
      url = url + '?';
      for (const [key, value] of Object.entries(serviceParams)) {
        // console.log({ key, value });
        url = url + key + '=' + value + '&';
        // console.log(key, value);
        // console.log('ssss', url);
      }
      url = url.slice(0, -1);
      // serviceParams.forEach(element => {
      //   url = url + element.key + '=' + element.value + '&'
      // });
    }

    // console.log('url', url);
    NetworkHandler.getInstance()
      .timeout(
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'Application/json',
            Authorization: `Bearer ${token}`,
            MBQDEBUG: 'MyBookQatar'
          }
          // body: JSON.stringify(serviceParams)
        })
      )
      .then(response => {
        // console.log('reponse', response);
        if (response.status === 401) {
          // UserModel.getInstance().signOut();
        }
        return response.json();
      })
      .then(responseJson => {
        // console.log('Responce from server is ', responseJson);
        if (responseJson.status === true) {
          // console.log('Success');
          successCallback(responseJson.data);
        } else {
          if (responseJson.error && responseJson.error.name === "TokenExpiredError") {
            // console.log('token Expired and refresh token called')
            return NetworkHandler.getInstance()
            .postRefreshTokenNetworkRequest(NetworkHandler.getInstance().getNetworkRequest, url, serviceParams, successCallback, failureCallback);
          }
          if (responseJson.message) {
            failureCallback(responseJson.message)
          }
          else if (responseJson.error) {
            failureCallback(responseJson.error.message)
          }
        }
        // if (responseJson.data !== null) {
        //   if (responseJson.status === true){
        //     console.log(responseJson)
        //     successCallback(responseJson.data);
        //   }
        //   else {
        //     failureCallback('Error in input params: '+ responseJson.error);
        //   }
        // } else {
        //     failureCallback('Error from server :'+ responseJson.error);
        // }
      })
      .catch(error => {
        failureCallback(error);
      });
  }

  getSearchNetworkRequest(
    url,
    token,
    serviceParams,
    successCallback,
    failureCallback
  ) {
    // console.log('parameters are : ' + JSON.stringify(serviceParams));

    if (serviceParams != null && !url.includes('?')) {
      url = url;
      for (const [key, value] of Object.entries(serviceParams)) {
        // console.log('obj enn', Object.entries(serviceParams));
        url = url + '&' + key + '=' + value;
      }
      // url = url.slice(0, -1);
      // serviceParams.forEach(element => {
      //   url = url + element.key + '=' + element.value + '&'
      // });
    }

    // console.log(url);
    NetworkHandler.getInstance()
      .timeout(
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'Application/json',
            Authorization: `Bearer ${token}`
            // MBQDEBUG: 'MyBookQatar'
          }
          // body: JSON.stringify(serviceParams)
        })
      )
      .then(response => {
        // console.log('reponse', response);
        if (response.status === 401) {
          // UserModel.getInstance().signOut();
        }
        return response.json();
      })
      .then(responseJson => {
        // console.log('Responce from server is ', responseJson);
        if (responseJson.status === true) {
          // console.log('Success');
          successCallback(responseJson.data);
        } else {
          if (responseJson.error && responseJson.error.name === "TokenExpiredError") {
            console.log(responseJson.status)
            console.log('token Expired and refresh token called')
            return NetworkHandler.getInstance()
            .postRefreshTokenNetworkRequest(NetworkHandler.getInstance().getSearchNetworkRequest, url, serviceParams, successCallback, failureCallback);
          }
          if (responseJson.message) {
            failureCallback(responseJson.message)
          }
          else if (responseJson.error) {
            failureCallback(responseJson.error.message)
          }
        }
        // if (responseJson.data !== null) {
        //   if (responseJson.status === true){
        //     console.log(responseJson)
        //     successCallback(responseJson.data);
        //   }
        //   else {
        //     failureCallback('Error in input params: '+ responseJson.error);
        //   }
        // } else {
        //     failureCallback('Error from server :'+ responseJson.error);
        // }
      })
      .catch(error => {
        failureCallback(error);
      });
  }

  getSkuNetworkRequest(
    url,
    token,
    serviceParams,
    successCallback,
    failureCallback
  ) {
    // console.log('parameters are : ' + JSON.stringify(serviceParams));

    if (serviceParams != null && !url.includes('?')) {
      url = url + serviceParams;
      // for (const [key, value] of Object.entries(serviceParams)) {
      //   console.log('obj enn', Object.entries(serviceParams));
      //   url = url + '&' + key + '=' + value;
      // }
      // url = url.slice(0, -1);
      // serviceParams.forEach(element => {
      //   url = url + element.key + '=' + element.value + '&'
      // });
    }

    // console.log(url);
    NetworkHandler.getInstance()
      .timeout(
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'Application/json',
            Authorization: `Bearer ${token}`
            // MBQDEBUG: 'MyBookQatar'
          }
          // body: JSON.stringify(serviceParams)
        })
      )
      .then(response => {
        // console.log('reponse', response);
        if (response.status === 401) {
          // UserModel.getInstance().signOut();
        }
        return response.json();
      })
      .then(responseJson => {
        // console.log('Responce from server is ', responseJson);
        if (responseJson.status === true) {
          // console.log('Success');
          successCallback(responseJson.data);
        } else {
          if (responseJson.error && responseJson.error.name === "TokenExpiredError") {
            console.log('token Expired and refresh token called')
            return NetworkHandler.getInstance()
            .postRefreshTokenNetworkRequest(NetworkHandler.getInstance().getSkuNetworkRequest, url, serviceParams, successCallback, failureCallback);
          }
          if (responseJson.message) {
            failureCallback(responseJson.message)
          }
          else if (responseJson.error) {
            failureCallback(responseJson.error.message)
          }
        }
      })
      .catch(error => {
        failureCallback(error);
      });
  }

  deleteNetworkRequest(
    url,
    token,
    serviceParams,
    successCallback,
    failureCallback
  ) {
    if (serviceParams != null && !url.includes('?')) {
      url = url + '?';
      for (const [key, value] of Object.entries(serviceParams)) {
        url = url + key + '=' + value + '&';
        // console.log(key, value);
      }
      url = url.slice(0, -1);
      // serviceParams.forEach(element => {
      //   url = url + element.key + '=' + element.value + '&'
      // });
    }
    NetworkHandler.getInstance()
      .timeout(
        fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'Application/json',
            Authorization: `Bearer ${token}`
            // MBQDEBUG: 'MyBookQatar'
          }
          // body: JSON.stringify(serviceParams)
        })
      )
      .then(response => {
        // console.log('reponse', response);
        if (response.status === 401) {
          // UserModel.getInstance().signOut();
        }
        return response.json();
      })
      .then(responseJson => {
        // console.log('Responce from server is ', responseJson);
        if (responseJson.status === true) {
          // console.log('Success');
          successCallback(responseJson.data);
        } else {
          if (responseJson.error && responseJson.error.name === "TokenExpiredError") {
            console.log('token Expired and refresh token called')
            return NetworkHandler.getInstance()
            .postRefreshTokenNetworkRequest(NetworkHandler.getInstance().deleteNetworkRequest, url, serviceParams, successCallback, failureCallback);
          }
          if (responseJson.message) {
            failureCallback(responseJson.message)
          }
          else if (responseJson.error) {
            failureCallback(responseJson.error.message)
          }
        }
        // if (responseJson.data !== null) {
        //   if (responseJson.status === true){
        //     console.log(responseJson)
        //     successCallback(responseJson.data);
        //   }
        //   else {
        //     failureCallback('Error in input params: '+ responseJson.error);
        //   }
        // } else {
        //     failureCallback('Error from server :'+ responseJson.error);
        // }
      })
      .catch(error => {
        failureCallback(error);
      });
  }

  updateNetworkRequest(
    url,
    token,
    serviceParams,
    successCallback,
    failureCallback
  ) {
    // if (serviceParams != null && !url.includes('?')) {
    //   url = url + '?'
    //   for (const [key, value] of Object.entries(serviceParams)) {
    //     url = url + key + '=' + value + '&'
    //     // console.log(key, value);
    //   }
    //   url = url.slice(0, -1)
    //   // serviceParams.forEach(element => {
    //   //   url = url + element.key + '=' + element.value + '&'
    //   // });
    // }
    NetworkHandler.getInstance()
      .timeout(
        fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'Application/json',
            Authorization: `Bearer ${token}`
            // MBQDEBUG: 'MyBookQatar'
          },
          body: JSON.stringify(serviceParams)
        })
      )
      .then(response => {
        // console.log('reponse', response);
        if (response.status === 401) {
          // UserModel.getInstance().signOut();
        }
        return response.json();
      })
      .then(responseJson => {
        // console.log('Responce from server is ', responseJson);
        if (responseJson.status === true) {
          // console.log('Success');
          successCallback(responseJson.data);
        } else {
          if (responseJson.error && responseJson.error.name === "TokenExpiredError") {
            console.log('token Expired and refresh token called')
            return NetworkHandler.getInstance()
            .postRefreshTokenNetworkRequest(NetworkHandler.getInstance().updateNetworkRequest, url, serviceParams, successCallback, failureCallback);
          }
          if (responseJson.message) {
            failureCallback(responseJson.message)
          }
          else if (responseJson.error) {
            failureCallback(responseJson.error.message)
          }
        }
        // if (responseJson.data !== null) {
        //   if (responseJson.status === true){
        //     console.log(responseJson)
        //     successCallback(responseJson.data);
        //   }
        //   else {
        //     failureCallback('Error in input params: '+ responseJson.error);
        //   }
        // } else {
        //     failureCallback('Error from server :'+ responseJson.error);
        // }
      })
      .catch(error => {
        failureCallback(error);
      });
  }

  postNetworkRequest(
    url,
    token,
    serviceParams,
    successCallback,
    failureCallback
  ) {
    let _headers = {
      'content-type': 'application/json'
    };
    if (token) {
      _headers['Authorization'] = `Bearer ${token}`;
    }
    // console.log('parameters are : ' + JSON.stringify(serviceParams));
    // console.log('url', url);
    NetworkHandler.getInstance()
      .timeout(
        fetch(url, {
          method: 'POST',
          headers: _headers,
          body: JSON.stringify(serviceParams)
        })
      )
      // .then((response) => {
      //   if (response.status === 401) {
      //     UserModel.getInstance().signOut();
      //   }
      // })
      .then(response => {
        if (response.status === 401) {
          // UserModel.getInstance().signOut();
        }
        return response.json();
      })
      .then(responseJson => {
        // console.log('Responce from server is ', responseJson);
        if (responseJson.status === true) {
          // console.log('Success');
          successCallback(responseJson.data);
        } else {
          if (responseJson.error && responseJson.error.name === "TokenExpiredError") {
            console.log('token Expired and refresh token called')
            return NetworkHandler.getInstance()
            .postRefreshTokenNetworkRequest(NetworkHandler.getInstance().postNetworkRequest, url, serviceParams, successCallback, failureCallback);
          }
          if (responseJson.message) {
            failureCallback(responseJson.message)
          }
          else if (responseJson.error) {
            failureCallback(responseJson.error.message)
          }
        }
        // if (responseJson.data !== null) {
        //   if (responseJson.status === true){
        //     successCallback(responseJson.data);
        //   }
        //   else {
        //     failureCallback('Error in input params: '+ responseJson.error);
        //   }
        // } else {
        //   console.log('server wala error')
        //     failureCallback('Error from server :'+ responseJson.error);
        // }
      })
      .catch(error => {
        failureCallback(error);
      });
  }

  postImageNetworkRequest(
    url,
    token,
    serviceParams,
    successCallback,
    failureCallback
  ) {
    // console.log('param form data', serviceParams);
    // console.log('token', token);
    // console.log('url', url);
    let _headers = {
      // 'content-type': 'multipart/form-data'
    };
    if (token) {
      _headers['Authorization'] = `Bearer ${token}`;
    }
    // console.log('parameters are : ' + serviceParams);
    NetworkHandler.getInstance()
      .timeout(
        fetch(url, {
          method: 'POST',
          headers: _headers,
          body: serviceParams
        })
      )
      // .then((response) => {
      //   if (response.status === 401) {
      //     UserModel.getInstance().signOut();
      //   }
      // })
      .then(response => {
        if (response.status === 401) {
          // UserModel.getInstance().signOut();
        }
        return response.json();
      })
      .then(responseJson => {
        // console.log('Responce from server is ', responseJson);
        if (responseJson.status === true) {
          // console.log('Success');
          successCallback(responseJson.data);
        } else {
          if (responseJson.error && responseJson.error.name === "TokenExpiredError") {
            console.log('token Expired and refresh token called')
            return NetworkHandler.getInstance()
            .postRefreshTokenNetworkRequest(NetworkHandler.getInstance().postImageNetworkRequest, url, serviceParams, successCallback, failureCallback);
          }
          if (responseJson.message) {
            failureCallback(responseJson.message)
          }
          else if (responseJson.error) {
            failureCallback(responseJson.error.message)
          }
        }
        // if (responseJson.data !== null) {
        //   if (responseJson.status === true){
        //     successCallback(responseJson.data);
        //   }
        //   else {
        //     failureCallback('Error in input params: '+ responseJson.error);
        //   }
        // } else {
        //   console.log('server wala error')
        //     failureCallback('Error from server :'+ responseJson.error);
        // }
      })
      .catch(error => {
        failureCallback(error);
      });
  }

  patchNetworkRequest(
    url,
    token,
    serviceParams,
    successCallback,
    failureCallback
  ) {
    let _headers = {
      'content-type': 'application/json'
    };
    if (token) {
      _headers['Authorization'] = `Bearer ${token}`;
    }
    // console.log('parameters are : ' + JSON.stringify(serviceParams));
    // console.log('url', url);
    NetworkHandler.getInstance()
      .timeout(
        fetch(url, {
          method: 'PATCH',
          headers: _headers,
          body: JSON.stringify(serviceParams)
        })
      )
      // .then((response) => {
      //   if (response.status === 401) {
      //     UserModel.getInstance().signOut();
      //   }
      // })
      .then(response => {
        if (response.status === 401) {
          // UserModel.getInstance().signOut();
        }
        return response.json();
      })
      .then(responseJson => {
        // console.log('Responce from server is ', responseJson);
        if (responseJson.status === true) {
          // console.log('Success');
          successCallback(responseJson.data);
        } else {
          if (responseJson.error && responseJson.error.name === "TokenExpiredError") {
            console.log('token Expired and refresh token called')
            return NetworkHandler.getInstance()
            .postRefreshTokenNetworkRequest(NetworkHandler.getInstance().patchNetworkRequest, url, serviceParams, successCallback, failureCallback);
          }
          if (responseJson.message) {
            failureCallback(responseJson.message)
          }
          else if (responseJson.error) {
            failureCallback(responseJson.error.message)
          }
        }
        // if (responseJson.data !== null) {
        //   if (responseJson.status === true){
        //     successCallback(responseJson.data);
        //   }
        //   else {
        //     failureCallback('Error in input params: '+ responseJson.error);
        //   }
        // } else {
        //   console.log('server wala error')
        //     failureCallback('Error from server :'+ responseJson.error);
        // }
      })
      .catch(error => {
        failureCallback(error);
      });
  }

  postFormRequest(url, token, serviceParams, successCallback, failureCallback) {
    // console.log('parameters are : ' + JSON.stringify(serviceParams));
    NetworkHandler.getInstance()
      .timeout(
        fetch(url, {
          method: 'POST',
          headers: {
            Authorization: token ? `Bearer ${token}` : null
            // MBQDEBUG: 'MyBookQatar'
          },
          body: serviceParams
        })
      )
      .then(response => {
        if (response.status === 401) {
          // UserModel.getInstance().signOut();
        }
        return response.json();
      })
      .then(responseJson => {
        // console.log('Responce from server is ', responseJson);
        if (responseJson.status === true) {
          // console.log('Success');
          successCallback(responseJson.data);
        } else {
          if (responseJson.error && responseJson.error.name === "TokenExpiredError") {
            console.log('token Expired and refresh token called')
            return NetworkHandler.getInstance()
            .postRefreshTokenNetworkRequest(NetworkHandler.getInstance().postFormRequest, url, serviceParams, successCallback, failureCallback);
          }
          if (responseJson.message) {
            failureCallback(responseJson.message)
          }
          else if (responseJson.error) {
            failureCallback(responseJson.error.message)
          }
        }
        // console.log('Responce from server is ', responseJson)
        // if (responseJson.data !== null) {
        //   if (responseJson.status === true){
        //     successCallback(responseJson.data);
        //   }
        //   else {
        //     failureCallback('Error in input params: '+ responseJson.message);
        //   }
        // } else {
        //     failureCallback('Error from server :'+ responseJson.message);
        // }
      })
      .catch(error => {
        failureCallback(error);
      });
  }

  getDownloadUrl(
    url,
    token,
    serviceParams,
    fileName,
    successCallback,
    failureCallback
  ) {
    // console.log('parameters are : ' + JSON.stringify(serviceParams));

    if (serviceParams != null && !url.includes('?')) {
      url = url + '?';
      for (const [key, value] of Object.entries(serviceParams)) {
        url = url + key + '=' + value + '&';
      }
      url = url.slice(0, -1);
    }
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
        // MBQDEBUG: 'MyBookQatar'
      }
    })
      .then(response => response.blob())
      .then(blob => {
        if (blob.type === 'text/csv') {
          // 2. Create blob link to download
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          // 3. Append to html page
          document.body.appendChild(link);
          // 4. Force download
          link.click();
          // 5. Clean up and remove the link
          link.parentNode.removeChild(link);
          successCallback('Preparing Download');
        } else {
          failureCallback('data not found');
        }
      })
      .catch(error => {
        failureCallback(error);
      });
  }
}
