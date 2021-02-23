/**
 * token handerler
 */

// dependencies
const data = require('../../lib/data');
const { hash, createRandom, perseJSON } = require('../../helpers/utillities');
// const {  } = require("../../helpers/utillities");

const handeler = {};
handeler.tokenHandeler = (requestProperties, callback) => {
  // accpect method
  const accpectMethod = ['get', 'post', 'put', 'delete'];
  if (accpectMethod.indexOf(requestProperties.method) > -1) {
    handeler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

// scaffolding
handeler._token = {};
// for post
handeler._token.post = (requestProperties, callback) => {
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

  if (phone && password) {
    data.read('users', phone, (err, userData) => {
      const hashPassword = hash(password);
      if (hashPassword === perseJSON(userData).password) {
        const tokenId = createRandom(20);
        const expire = Date.now() + 60 * 60 * 1000;
        const tokenObject = {
          phone,
          id: tokenId,
          expires: expire,
        };
        // store the token to data storage
        data.create('token', tokenId.split(' ').join(''), tokenObject, (err2) => {
          if (!err2) {
            callback(200, { tokenObject });
          } else {
            callback(500, { error: 'there wase a problem in a server side' });
          }
        });
      } else {
        callback(400, { error: 'Password is not a valid' });
      }
    });
  } else {
    callback(400, { error: 'you have a problem in your request' });
  }
};

// for get
handeler._token.get = (requestProperties, callback) => {
  // check the id is valid
  const id =
    typeof requestProperties.querystringObject.id === 'string' &&
    requestProperties.querystringObject.id.trim().length === 20
      ? requestProperties.querystringObject.id
      : false;
  if (id) {
    // look up the token
    data.read('token', id, (err, tokenData) => {
      const token = perseJSON(tokenData);
      if (!err) {
        callback(200, token);
      } else {
        callback(404, { error: 'Request token was not found' });
      }
    });
  } else {
    callback(404, { error: 'something went wrong' });
  }
};

// for put
handeler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  const extend = !!(
    typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
  );

  if (id && extend) {
    data.read('token', id, (err, tokenData) => {
      const tokenObject = perseJSON(tokenData);
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() * 60 * 60 * 1000;

        // store the update token
        data.update('token', id, tokenObject, (err2) => {
          if (!err2) {
            callback(200);
          } else {
            callback(400, { error: 'No update token' });
          }
        });
      } else {
        callback(400, { error: 'Token already expired' });
      }
    });
  } else {
    callback(404, { error: 'There was a problem in your request' });
  }
};

// for delete
handeler._token.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.querystringObject.id === 'string' &&
    requestProperties.querystringObject.id.trim().length === 20
      ? requestProperties.querystringObject.id
      : false;
  if (id) {
    data.read('token', id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete('token', id, (err1) => {
          if (!err1) {
            callback(200, { message: 'Token delete successfully' });
          } else {
            callback(404, { error: 'Token do not delete' });
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

// token valid
handeler._token.verify = (id, phone, callback) => {
  data.read('token', id, (err, tokenData) => {
    if (!err && tokenData) {
      if (perseJSON(tokenData).phone === phone && perseJSON(tokenData).expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handeler;
