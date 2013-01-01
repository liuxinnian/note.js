/**
 * Application setting
 * @type {object}
 */
var dbCloud = 'mongodb://root:whoami@mongo.onmodulus.net:27017/ujO6xoni',
    dbLocal = 'mongodb://root:whoami@127.0.0.1:27017/itnote';

module.exports = { 
  dsn: (process.env.PORT) ? dbCloud : dbLocal, // process.env.PORT for modulus.io
  http: {
    port: 3000
  }
};
