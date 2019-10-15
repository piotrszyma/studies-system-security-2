const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { OpenApiValidator } = require("express-openapi-validator");

const app = express()
const port = 3000

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

new OpenApiValidator({
  apiSpec: 'api.yaml',
  validateResponses: true, // false by default
}).install(app);

app.use('/protocols', require('./routes/list'));
app.use('/protocols/sis', require('./routes/sis'));
app.use('/protocols/sss', require('./routes/sss'));

app.use(function (error, req, res, next) {
  res.status(404).json({ message: error.message });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
