/**
 * all environment
 */

//  moudle scaffolding

const environment = {};
require('dotenv').config();

environment.staging = {
  port: 3000,
  envName: 'staging',
  screctkey: 'hksdjfhkdsjfskjdndfs',
  maxCheck: 5,
  twilio: {
    fromPhone: process.envFROM_PHONE,
    accountSid: process.envACCOUNT_SID,
    authToken: process.envAUTH_TOKEN,
  },
};

environment.production = {
  port: 5000,
  envName: 'production',
  screctkey: 'sdfdsfdsfdffdghf',
  maxCheck: 5,
  twilio: {
    fromPhone: process.envFROM_PHONE,
    accountSid: process.envACCOUNT_SID,
    authToken: process.envAUTH_TOKEN,
  },
};

// determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment
const environmentToExport =
  typeof environment[currentEnvironment] === 'object'
    ? environment[currentEnvironment]
    : environment.staging;

//  export
module.exports = environmentToExport;
