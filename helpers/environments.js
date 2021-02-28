/**
 * all environment
 */

//  moudle scaffolding

const environment = {};

environment.staging = {
  port: 3000,
  envName: 'staging',
  screctkey: 'hksdjfhkdsjfskjdndfs',
  maxCheck: 5,
  twilio: {
    fromPhone: '+15403286203',
    accountSid: 'AC382c28faa0060b57995753e6a116e9dd',
    authToken: '2c482cbf3d66c1c23efcb82243ac97f5',
  },
};

environment.production = {
  port: 5000,
  envName: 'production',
  screctkey: 'sdfdsfdsfdffdghf',
  maxCheck: 5,
  twilio: {
    fromPhone: '+15403286203',
    accountSid: 'AC382c28faa0060b57995753e6a116e9dd',
    authToken: '2c482cbf3d66c1c23efcb82243ac97f5',
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
