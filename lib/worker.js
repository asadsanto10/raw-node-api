/**
 * name: worker library
 * date: 24.02.21
 */
//  dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const { parseJSON } = require('../helpers/utillities');
const { sendTwilioSms } = require('../helpers/notification');

// worker object scaffolding
const worker = {};

// look up all the check
worker.allCheck = () => {
  // get all the check
  data.list('check', (err, checks) => {
    if (!err && checks && checks.length > 0) {
      checks.forEach((readcheck) => {
        //   read the check data
        data.read('check', readcheck, (err1, checkData) => {
          if (!err1 && checkData) {
            // pass the data to the check valid

            worker.validateData(parseJSON(checkData));
          } else {
            console.log('error reading check data faild');
          }
        });
      });
    } else {
      console.log('error: could not find and check to process');
    }
  });
};

// validate individual checks data

worker.validateData = (checkData) => {
  const orginalData = checkData;
  if (checkData && checkData.id) {
    orginalData.state =
      typeof checkData.state === 'string' && ['up', 'down'].includes(checkData.state) > -1
        ? checkData.state
        : 'down';

    orginalData.lastCheck =
      typeof checkData.state === 'number' && checkData.state > 0 ? checkData.state : false;

    //   pass to the next process
    worker.perfromCheck(orginalData);
  } else {
    console.log('error check was invalid');
  }
};

// perfrom check
worker.perfromCheck = (checkData) => {
  // prepear the initial check
  let checkOutCoeme = {
    error: false,
    responseCode: false,
  };

  // mark the outcomes has not set yet
  let outcomeSetn = false;

  // parse the host name from orginal Data
  const parseurl = url.parse(`${checkData.protocol}://${checkData.url}`, true);
  const { hostname } = parseurl;
  const { path } = parseurl;

  // construct the request

  const requestDetails = {
    protocol: `${checkData.protocol}:`,
    hostname,
    method: checkData.method.toUpperCase(),
    path,
    timeOut: checkData.timeOutSecond * 1000,
  };

  // method to user
  const protocolToUse = checkData.protocol === 'http' ? http : https;

  const req = protocolToUse.request(requestDetails, (res) => {
    // grav the status of the response
    const status = res.statusCode;

    // update the check outcome and pass the next process'
    checkOutCoeme.responseCode = status;
    if (!outcomeSetn) {
      worker.processCheckOutcome(checkData, checkOutCoeme);
      outcomeSetn = true;
    }
  });

  req.on('error', (err) => {
    checkOutCoeme = {
      error: true,
      value: err,
    };
    // update the check outcome and pass the next process
    if (!outcomeSetn) {
      worker.processCheckOutcome(checkData, checkOutCoeme);
      outcomeSetn = true;
    }
  });

  req.on('timeout', () => {
    checkOutCoeme = {
      error: true,
      value: 'timeout',
    };
    // update the check outcome and pass the next process
    if (!outcomeSetn) {
      worker.processCheckOutcome(checkData, checkOutCoeme);
      outcomeSetn = true;
    }
  });
  // request sent
  req.end();
};

// save check outcome to database
worker.processCheckOutcome = (checkData, checkOutCoeme) => {
  // check if check out come is up or down
  const state =
    !checkOutCoeme.error &&
    checkOutCoeme.responseCode &&
    checkData.sucessCode.indexOf(checkOutCoeme.responseCode) > -1
      ? 'up'
      : 'down';

  // decide wether we should alert the user or not
  const alertWanted = !!(checkData.lastCheck && checkData.state !== state);

  // update the check data
  const newCheckData = checkData;

  newCheckData.state = state;
  newCheckData.lastCheck = Date.now();

  // update the check to disk
  data.update('check', newCheckData.id, newCheckData, (err) => {
    if (!err) {
      if (!alertWanted) {
        // saend the check data to next prcess
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log('alert is not needed as there is no state change');
      }
    } else {
      console.log('error: trying to save data ');
    }
  });
};

// send notfication sms to user if state change
worker.alertUserToStatusChange = (newCheckData) => {
  const msg = `Alert: your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;

  sendTwilioSms(newCheckData.userPhone, msg, (err) => {
    if (!err) {
      console.log(`user was alerted to status change vai to sms ${msg}`);
    } else {
      console.log('there is problem to send sms');
    }
  });
};

//  timer to execute the worker process
worker.loop = () => {
  setInterval(() => {
    worker.allCheck();
  }, 5000);
};

worker.init = () => {
  // execute all the check
  worker.allCheck();

  //   call the loop so that check continue
  worker.loop();
};

module.exports = worker;
