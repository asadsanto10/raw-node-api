/**
 * all utillities
 */

// dependencies
const crypto = require('crypto'); // password hasing or password protect
const environments = require('./environments');
//  moudle scaffolding
const utillities = {};

// parse json strin to object
utillities.perseJSON = (jsonSting) => {
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

//  export
module.exports = utillities;
