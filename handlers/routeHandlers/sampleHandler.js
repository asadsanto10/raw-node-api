/**
 * sample handeler
 */

//  module scaffolding
const handeler = {};

handeler.sampleHandeler = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(200, {
    message: 'This is a sample url',
  });
};

module.exports = handeler;
