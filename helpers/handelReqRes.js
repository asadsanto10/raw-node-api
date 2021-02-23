/**
 * requesr responce handel for all
 */

//  moudle scaffolding
const handler = {};

// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../route');
const { notFoundHandeler } = require('../handlers/routeHandlers/notFoundHandeler');
const { perseJSON } = require('./utillities');

// handel request response
handler.handelReqRes = (req, res) => {
  // request handel
  const parseurl = url.parse(req.url, true); // get the url and parse it

  const path = parseurl.pathname; // get the url path name

  const trimPath = path.replace(/^\/+|\/+$/g, ''); // remove trailing slash from"); //

  const method = req.method.toLowerCase(); // get the method like as GET, POST, DELETE, PUT etc

  const querystringObject = parseurl.query; // get the querystring

  const headerObject = req.headers; // get the meta data from server or others

  const requestProperties = {
    parseurl,
    path,
    trimPath,
    method,
    querystringObject,
    headerObject,
  };

  // buffer
  const decoder = new StringDecoder('utf-8');
  let realData = '';

  const chosenHandler = routes[trimPath] ? routes[trimPath] : notFoundHandeler;

  req.on('data', (data) => {
    realData += decoder.write(data);
  });

  req.on('end', () => {
    realData += decoder.end();

    requestProperties.body = perseJSON(realData);

    chosenHandler(requestProperties, (statusCode, playload) => {
      let setStatusCode = statusCode;
      let setPlayload = playload;
      setStatusCode = typeof setStatusCode === 'number' ? setStatusCode : 500;
      setPlayload = typeof setPlayload === 'object' ? setPlayload : {};

      const playloadString = JSON.stringify(setPlayload);

      // return the final response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(setStatusCode);
      res.end(playloadString);
    });
  });
};

// moudee exports
module.exports = handler;
