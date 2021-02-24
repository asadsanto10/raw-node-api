/**
 * route application
 */
// dependencies
const { sampleHandeler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandeler } = require('./handlers/routeHandlers/userHandeler');
const { tokenHandeler } = require('./handlers/routeHandlers/tokenHandeler');
const { checkeHandler } = require('./handlers/routeHandlers/checkeHandler');

const routes = {
  sample: sampleHandeler,
  user: userHandeler,
  token: tokenHandeler,
  check: checkeHandler,
};

module.exports = routes;
