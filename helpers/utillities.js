/**
 * all utillities
 */

// dependencies
const crypto = require('crypto'); // password hasing or password protect
const environments = require('./environments');
//  moudle scaffolding
const utillities = {};

// parse json strin to object
utillities.parseJSON = (jsonSting) => {
  let output;

  try {
    output = JSON.parse(jsonSting);
  } catch {
    output = {};
  }
  return output;
};

// password protected cripto
utillities.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', environments.screctkey).update(str).digest('hex');
    return hash;
  }
  return false;
};

// token generate random
// password protected cripto
utillities.createRandom = (stringLength) => {
  let length = stringLength;
  length = typeof stringLength === 'number' && stringLength > 0 ? stringLength : false;

  if (length) {
    const charecter = 'abcdefghijklmnopqrstuvwxyz123456789';
    let output = '';
    for (let i = 1; i <= length; i += 1) {
      const randomCharecter = charecter.charAt(Math.floor(Math.random() * charecter.length));

      output += randomCharecter;
    }
    return output;
  }
  return false;
};

//  export
module.exports = utillities;
