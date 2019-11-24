const https = require('https');
const http = require('http');
const fs = require('fs');
const { app } = require('./app');

const options = {
  key: fs.readFileSync('cert/privkey.pem'),
  cert: fs.readFileSync('cert/cert.pem'),
  ca: fs.readFileSync('cert/chain.pem'),
};

http.createServer(app).listen(8080);
https.createServer(options, app).listen(8443);
