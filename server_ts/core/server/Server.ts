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
    const options = <https.ServerOptions>{
      key: fs.readFileSync('cert/privkey.pem'),
      cert: fs.readFileSync('cert/cert.pem'),
      ca: fs.readFileSync('cert/chain.pem'),
    };

    this.httpServer = http.createServer(app);
    this.httpsServer = https.createServer(options, app);
    this.config = config;
  }

  run() {
    this.httpServer.listen(this.config.getHttpPort());
    this.httpsServer.listen(this.config.getHttpsPort());
  }
}