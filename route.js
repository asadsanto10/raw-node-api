/**
 * route application
 */
// dependencies
const { sampleHandeler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandeler } = require("./handlers/routeHandlers/userHandeler");
const routes = {
  sample: sampleHandeler,
  user: userHandeler,
};

module.exports = routes;
