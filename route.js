/**
 * route application
 */
// dependencies
const { sampleHandeler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandeler } = require('./handlers/routeHandlers/userHandeler');
const { tokenHandeler } = require('./handlers/routeHandlers/tokenHandeler');

const routes = {
  sample: sampleHandeler,
  user: userHandeler,
  token: tokenHandeler,
};

module.exports = routes;
