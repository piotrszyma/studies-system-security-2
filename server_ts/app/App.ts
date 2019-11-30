import express from 'express';
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { OpenApiValidator } = require("express-openapi-validator");
import router from './routes';

// TODO: Add validator.
// new OpenApiValidator({
//   apiSpec: 'api.yaml',
//   validateResponses: false, // its broken
// }).install(app);

// app.use('/protocols/', require('./routes/list'));
// app.use('/protocols/sis', require('./routes/sis'));
// app.use('/protocols/sss', require('./routes/sss'));
// app.use('/protocols/ois', require('./routes/ois'));
// app.use('/protocols/msis', require('./routes/msis'));
// app.use('/protocols/blsss', require('./routes/blsss'));
// app.use('/protocols/gjss', require('./routes/gjss'));
// app.use('/protocols/naxos', require('./routes/naxos'));
// app.use('/salsa/protocols', require('./routes/encryptions/salsa'));
// app.use('/chacha/protocols', require('./routes/encryptions/chacha'));

type ExpressApp = any;

export default class App {
  static _instance: App;
  private _expressApp: ExpressApp;

  constructor() {
    const expressApp = <ExpressApp>express();
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.text());
    expressApp.use(bodyParser.urlencoded({ extended: true }));
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: false }));
    expressApp.use(cookieParser());
    expressApp.use(morgan('combined'));
    expressApp.use(function (error, req, res, next) {
      console.log(error);
      res.status(404).json({ message: error.message });
    });
    expressApp.use(router);
    this._expressApp = expressApp;
  }

  getExpressApp(): ExpressApp {
    return this._expressApp;
  }

  static getInstance(): App {
    if (this._instance) {
      this._instance = new App();
    }
    return this._instance;
  }
}