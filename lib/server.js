/**
 * title: server library
 * date: 19.02.21
 */

//  dependencies
const http = require('http');
const { handelReqRes } = require('../helpers/handelReqRes');
const environment = require('../helpers/environments');
// const { sendTwilioSms } = require('./helpers/notification');
// const data = require('./lib/data');
// app object - module scaffolding
const server = {};

// create server
server.createServer = () => {
  const createServerVariable = http.createServer(server.haderlReqRes);
  createServerVariable.listen(environment.port, () => {
    console.log(`Listening to port ${environment.port}`);
  });
};

// handel request response
server.haderlReqRes = handelReqRes;

// start the server
server.init = () => {
  server.createServer();
};

module.exports = server;
