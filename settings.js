module.exports = { 
  db: {
    host: (process.env.PORT) ? 'mongo.onmodulus.net' : '127.0.0.1',  // process.env.PORT for modulus.io
    port: 27017,
    name: 'name',
    user: 'user',
    pass: 'pass'
  },
  http: {
    port: 3000
  }
};
