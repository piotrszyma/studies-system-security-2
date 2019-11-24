const https = require('https');
const http = require('http');
const fs = require('fs');
const { app } = require('./app');
const config = require('./config');

const options = {
  key: fs.readFileSync('cert/privkey.pem'),
  cert: fs.readFileSync('cert/cert.pem'),
  ca: fs.readFileSync('cert/chain.pem'),
};

const httpServer = http.createServer(app);
httpServer.listen(config.serverConfig.httpPort);

const httpsServer = https.createServer(options, app);
httpsServer.listen(config.serverConfig.httpsPort);

console.log(`httpServer listens on: ${httpServer.address().port}`);
console.log(`httpsServer listens on: ${httpsServer.address().port}`);
