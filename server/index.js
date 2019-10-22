const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('../config');
const morgan = require('morgan');

const { OpenApiValidator } = require("express-openapi-validator");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('combined'));

new OpenApiValidator({
  apiSpec: 'api.yaml',
  validateResponses: false, // its broken
}).install(app);

app.use('/protocols', require('./routes/list'));
app.use('/protocols/sis', require('./routes/sis'));
app.use('/protocols/sss', require('./routes/sss'));
app.use('/protocols/ois', require('./routes/ois'));

app.use(function (error, req, res, next) {
  res.status(404).json({ message: error.message });
});

app.listen(config.port, () => console.log(`App listening on port ${config.port}!`));
