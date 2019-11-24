import * as http from "http";
import * as https from "https";
import * as fs from "fs";

import ServerConfig from "./ServerConfig";
import { Application } from "express";

export default class Server {
  httpServer: any;
  httpsServer: any;
  config: ServerConfig;

  constructor(app: Application, config: ServerConfig) {
    this.httpServer = http.createServer(app);
    this.httpsServer = https.createServer(config.sslKeys, app);
    this.config = config;
  }

  run() {
    this.httpServer.listen(this.config.ports.httpPort);
    this.httpsServer.listen(this.config.ports.httpsPort);
    console.log('Serving on ports', this.config.ports)
  }
}