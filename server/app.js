const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

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
app.use('/protocols/gjss', require('./routes/gjss'));
app.use('/protocols/naxos', require('./routes/naxos'));
app.use('/protocols/sigma', require('./routes/sigma'));
app.use('/salsa/protocols', require('./routes/encryptions/salsa'));
app.use('/chacha/protocols', require('./routes/encryptions/chacha'));

app.use(function (error, req, res, next) {
  // console.log(error);
  res.status(404).json({ message: error.message });
});


module.exports = { app, appRouter: app._router };