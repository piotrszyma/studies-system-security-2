import express from 'express';
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
import router from './routes';

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
    expressApp.use((error, req, res, next) => {
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