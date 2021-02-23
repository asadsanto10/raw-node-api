/**
 * title: uptime monitoring application
 * date: 19.02.21
 */

//  dependencies
const http = require('http');
const { handelReqRes } = require('./helpers/handelReqRes');
const environment = require('./helpers/environments');
// const data = require('./lib/data');
// app object - module scaffolding
const app = {};
// testing data********
// TODO: pore muche dibo
// data create ***********
// data.create(
//   "/test",
//   "newFile",
//   {
//     name: "Bangladesh",
//     language: "bangla",
//   },
//   (err) => {
//     console.log(`error was ${err}`);
//   }
// );

// data read ********
// data.read("/", "newFile", (err, data) => {
//   console.log(err, data);
// });

// data update
// data.update("/", "newFile", { name: "santo", language: "english" }, (err) => {
//   console.log(err);
// });

// data delete ********
// data.delete("/", "newFile", (err) => {
//   console.log(err);
// });

// create server
app.createServer = () => {
  const server = http.createServer(app.haderlReqRes);
  server.listen(environment.port, () => {
    console.log(`Listening to port ${environment.port}`);
  });
};

// handel request response
app.haderlReqRes = handelReqRes;

// start the server
app.createServer();
