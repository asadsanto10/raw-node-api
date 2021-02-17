/**
 * user handerler
 */

// dependencies
const data = require('../../lib/data');
const { hash, perseJSON } = require('../../helpers/utillities');
// const {  } = require("../../helpers/utillities");

const handeler = {};
handeler.userHandeler = (requestProperties, callback) => {
  // accpect method
  const accpectMethod = ['get', 'post', 'put', 'delete'];
  if (accpectMethod.indexOf(requestProperties.method) > -1) {
    handeler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

// scaffolding
handeler._users = {};
// for post
handeler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === 'string' &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  const tosAgrement =
    typeof requestProperties.body.tosAgrement === 'boolean' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.tosAgrement
      : false;

  if (firstName && lastName && phone && password && tosAgrement) {
    // make sure that the user does not already have an account
    data.read('users', phone, (err) => {
      if (err) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgrement,
        };

        // store the user to databse
        data.create('users', phone, userObject, (err2) => {
          if (!err2) {
            callback(200, { message: 'User was created successfully' });
          } else {
            callback(500, { error: 'Already create user' });
          }
        });
      } else {
        callback(500, {
          error: 'There was an error in server side',
        });
      }
    });
  } else {
    callback(400, {
      error: 'You have a problem in your request',
    });
  }
};
// for get
handeler._users.get = (requestProperties, callback) => {
  // check the query sstring valid
  const { phone } = requestProperties.querystringObject;
  // console.log(phone);
  if (phone) {
    // look up the user
    data.read('users', phone, (err, userData) => {
      const user = { ...perseJSON(userData) };
      console.log(user);
      if (!err) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, { error: 'Request user was not found' });
        console.log(err);
      }
    });
  } else {
    callback(404, { error: 'something went wrong' });
  }
};

// for put
handeler._users.put = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === 'string' &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  // find user
  if (phone) {
    if (firstName || lastName || phone) {
      data.read('users', phone, (err, userData) => {
        const user = { ...perseJSON(userData) };
        if (!err && user) {
          if (firstName) {
            user.firstName = firstName;
          }
          if (lastName) {
            user.lastName = lastName;
          }
          if (password) {
            user.phone = hash(password);
          }

          // update data
          data.update('users', phone, user, (err1) => {
            if (!err1) {
              callback(200, { message: 'successfully update data' });
            } else {
              callback(404, { error: 'data not update priority' });
            }
          });
        } else {
          callback(404, { error: 'something went wrong' });
        }
      });
    } else {
      callback(404, { error: 'please select a input field' });
    }
  } else {
    callback(404, { error: 'user not found' });
  }
};

// for delete
handeler._users.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.querystringObject.phone === 'string' &&
    requestProperties.querystringObject.phone.trim().length === 11
      ? requestProperties.querystringObject.phone
      : false;
  if (phone) {
    data.read('users', phone, (err, userData) => {
      if (!err && userData) {
        data.delete('users', phone, (err1) => {
          if (!err1) {
            callback(200, { message: 'data delete successfully' });
          } else {
            callback(404, { error: 'data do not delete' });
            console.log(err1);
          }
        });
      } else {
        callback(500, { error: 'this is a server side error' });
      }
    });
  } else {
    callback(404, { error: 'there wse problem in your request' });
  }
};

module.exports = handeler;
