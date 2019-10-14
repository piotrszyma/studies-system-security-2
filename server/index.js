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

const indexRouter = require('./routes/index');
const sisRoutes = require('./routes/sis');
const sssRoutes = require('./routes/sss');

app.use('/', indexRouter);
app.use('/protocols/sis', sisRoutes);
app.use('/protocols/sss', sssRoutes);

app.use(function (error, req, res, next) {
  res.json({ message: error.message });
});

app.listen(port, () => console.log(`App listening on port ${port}!`))