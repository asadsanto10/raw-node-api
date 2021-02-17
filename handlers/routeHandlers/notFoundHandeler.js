/**
 * not found handeler
 */

//  module scaffolding
const handeler = {};

handeler.notFoundHandeler = (requestProperties, callback) => {
  callback(404, {
    message: 'Not Found',
  });
};

module.exports = handeler;
