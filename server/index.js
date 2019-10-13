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
const schnorrRoutes = require('./routes/schnorr');

app.use('/', indexRouter);
app.use('/protocols/sis', schnorrRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      name: err.name,
      message: err.message,
      data: err.data,
    },
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))