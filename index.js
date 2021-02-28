/**
 * title: project initial file
 * date: 19.02.21
 */

//  dependencies
const server = require('./lib/server');
const worker = require('./lib/worker');
// app object - module scaffolding
const app = {};

app.init = () => {
  // start the server
  server.init();
  // start the worker
  worker.init();
};

app.init();

// export

module.exports = app;
