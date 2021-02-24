/**
 * Check handerler
 */

// dependencies
const data = require('../../lib/data');
const { parseJSON, createRandom } = require('../../helpers/utillities');
const tokenHandeler = require('./tokenHandeler');
const { maxCheck } = require('../../helpers/environments');

const handeler = {};
handeler.checkeHandler = (requestProperties, callback) => {
  // accpect method
  const accpectMethod = ['get', 'post', 'put', 'delete'];
  if (accpectMethod.indexOf(requestProperties.method) > -1) {
    handeler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

// scaffolding
handeler._check = {};
// for post
handeler._check.post = (requestProperties, callback) => {
  // valid input
  const protocol =
    typeof requestProperties.body.protocol === 'string' &&
    ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === 'string' &&
    ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCode =
    typeof requestProperties.body.successCode === 'object' &&
    requestProperties.body.successCode instanceof Array
      ? requestProperties.body.successCode
      : false;

  const timeOutSecond =
    typeof requestProperties.body.timeOutSecond === 'number' &&
    requestProperties.body.timeOutSecond % 1 === 0 &&
    requestProperties.body.timeOutSecond >= 1 &&
    requestProperties.body.timeOutSecond <= 5
      ? requestProperties.body.timeOutSecond
      : false;

  if (protocol && url && method && successCode && timeOutSecond) {
    const token =
      typeof requestProperties.headerObject.token === 'string'
        ? requestProperties.headerObject.token
        : false;

    // look up the user phon by read the token
    data.read('token', token, (err, tokenData) => {
      if (!err && tokenData) {
        const userPhone = parseJSON(tokenData).phone;

        // look up the user data
        data.read('users', userPhone, (err1, usersdata) => {
          if (!err1 && usersdata) {
            tokenHandeler._token.verify(token, userPhone, (tokeValid) => {
              if (tokeValid) {
                const userObject = parseJSON(usersdata);

                const userChecks =
                  typeof userObject.checks === 'object' && typeof userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < maxCheck) {
                  const checkId = createRandom(20);
                  const checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    sucessCode: successCode,
                    timeOutSecond,
                  };

                  //   save the object
                  data.create('check', checkId, checkObject, (err2) => {
                    if (!err2) {
                      // add check id to the users object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      //   save the new user data
                      data.update('users', userPhone, userObject, (err4) => {
                        if (!err4) {
                          // return the data about new check
                          callback(200, userObject);
                        } else {
                          callback(500, { error: 'not update' });
                        }
                      });
                    } else {
                      callback(500, { error: 'there was a problem in server request' });
                    }
                  });
                } else {
                  callback(401, { error: 'already max check limit' });
                }
              } else {
                callback(403, { error: 'Authentication Faild' });
              }
            });
          } else {
            callback(403, { error: 'user not found' });
          }
        });
      } else {
        callback(403, { error: 'Authentication problem' });
      }
    });
  } else {
    callback(400, { error: 'you have a problem with the request' });
  }
};

// for get
handeler._check.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.querystringObject.id === 'string' &&
    requestProperties.querystringObject.id.trim().length === 20
      ? requestProperties.querystringObject.id
      : false;
  if (id) {
    // look up the check
    data.read('check', id, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof requestProperties.headerObject.token === 'string'
            ? requestProperties.headerObject.token
            : false;
        tokenHandeler._token.verify(token, parseJSON(checkData).userPhone, (tokeValid) => {
          if (tokeValid) {
            callback(200, parseJSON(checkData));
          } else {
            callback(403, { error: 'Authentication faild' });
          }
        });
      } else {
        callback(500, { error: 'there was a problem in server request' });
      }
    });
  } else {
    callback(400, { error: 'you have a problem with the request' });
  }
};

// for put
handeler._check.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  const protocol =
    typeof requestProperties.body.protocol === 'string' &&
    ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === 'string' &&
    ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCode =
    typeof requestProperties.body.successCode === 'object' &&
    requestProperties.body.successCode instanceof Array
      ? requestProperties.body.successCode
      : false;

  const timeOutSecond =
    typeof requestProperties.body.timeOutSecond === 'number' &&
    requestProperties.body.timeOutSecond % 1 === 0 &&
    requestProperties.body.timeOutSecond >= 1 &&
    requestProperties.body.timeOutSecond <= 5
      ? requestProperties.body.timeOutSecond
      : false;
  if (id) {
    if (protocol || method || successCode || timeOutSecond || url) {
      data.read('check', id, (err, checkData) => {
        if (!err && checkData) {
          const checkObject = parseJSON(checkData);
          const token =
            typeof requestProperties.headerObject.token === 'string'
              ? requestProperties.headerObject.token
              : false;
          tokenHandeler._token.verify(token, checkObject.userPhone, (tokeValid) => {
            if (tokeValid) {
              if (protocol) {
                checkObject.protocol = protocol;
              }
              if (url) {
                checkObject.url = url;
              }
              if (method) {
                checkObject.method = method;
              }
              if (successCode) {
                checkObject.successCode = successCode;
              }
              if (timeOutSecond) {
                checkObject.timeOutSecond = timeOutSecond;
              }

              // update data
              data.update('check', id, checkObject, (err2) => {
                if (!err2) {
                  callback(200, { message: 'update success' });
                } else {
                  callback(403, { error: 'Data not updated' });
                }
              });
            } else {
              callback(403, { error: 'Authentication faild' });
            }
          });
        } else {
          callback(500, { error: 'there was a problem in server request' });
        }
      });
    } else {
      callback(400, { error: 'Must be provide at list one field' });
    }
  } else {
    callback(400, { error: 'you have a problem with the request' });
  }
};

// for delete
handeler._check.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.querystringObject.id === 'string' &&
    requestProperties.querystringObject.id.trim().length === 20
      ? requestProperties.querystringObject.id
      : false;
  if (id) {
    // look up the check
    data.read('check', id, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof requestProperties.headerObject.token === 'string'
            ? requestProperties.headerObject.token
            : false;
        tokenHandeler._token.verify(token, parseJSON(checkData).userPhone, (tokeValid) => {
          if (tokeValid) {
            // delete the check data
            const checkObject = parseJSON(checkData);
            data.delete('check', id, (err1) => {
              if (!err1) {
                data.read('users', checkObject.userPhone, (err3, userData) => {
                  if (!err3 && userData) {
                    const userObject = parseJSON(userData);
                    const userChecks =
                      typeof userObject.checks === 'object' && userObject.checks instanceof Array
                        ? userObject.checks
                        : [];

                    // remove the deleted check id from user list of check
                    const checkPosition = userChecks.indexOf(id);

                    if (checkPosition > -1) {
                      userChecks.splice(checkPosition, 1);
                      // resave the user data
                      data.update('users', userObject.phone, userObject, (err4) => {
                        if (!err4) {
                          callback(200, { message: 'success' });
                        } else {
                          callback(500, { error: 'there was a problem in server request' });
                        }
                      });
                    } else {
                      callback(500, { error: 'Remove not found' });
                    }
                  } else {
                    callback(403, { error: 'User data not found' });
                  }
                });
              } else {
                callback(500, { error: 'there was a problem in server request' });
              }
            });
          } else {
            callback(403, { error: 'Authentication faild' });
          }
        });
      } else {
        callback(500, { error: 'there was a problem in server request' });
      }
    });
  } else {
    callback(400, { error: 'you have a problem with the request' });
  }
};

module.exports = handeler;
