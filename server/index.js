const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const https = require('https');
const http = require('http');
const fs = require('fs');

const { OpenApiValidator } = require("express-openapi-validator");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('combined'));

// TODO: Add validator.
// new OpenApiValidator({
//   apiSpec: 'api.yaml',
//   validateResponses: false, // its broken
// }).install(app);

app.use('/protocols/', require('./routes/list'));
app.use('/protocols/sis', require('./routes/sis'));
app.use('/protocols/sss', require('./routes/sss'));
app.use('/protocols/ois', require('./routes/ois'));
app.use('/protocols/msis', require('./routes/msis'));
app.use('/protocols/blsss', require('./routes/blsss'));

app.use(function (error, req, res, next) {
  res.status(404).json({ message: error.message });
});

const options = {
  key: fs.readFileSync('cert/privkey.pem'),
  cert: fs.readFileSync('cert/cert.pem'),
  ca: fs.readFileSync('cert/chain.pem'),
};

http.createServer(app).listen(8080);
https.createServer(options, app).listen(8443);
