import * as http from "http";
import * as https from "https";

import AppConfig from "./AppConfig";
import App from "./App";


export default class AppServer {
  httpServer: http.Server;
  httpsServer: https.Server;
  config: AppConfig;

  constructor(app: App, config: AppConfig) {
    this.httpServer = http.createServer(app.getExpressApp());
    this.httpsServer = https.createServer(config.sslKeys, app.getExpressApp());
    this.config = config;
  }

  run(): void {
    this.httpServer.listen(this.config.ports.httpPort);
    this.httpsServer.listen(this.config.ports.httpsPort);
    console.log('Serving on ports', this.config.ports)
  }
}

