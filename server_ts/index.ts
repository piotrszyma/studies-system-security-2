import * as fs from 'fs';

import Server from "./core/server/Server";
import ServerConfig from "./core/server/ServerConfig";
import app from "./core/app/app";

const serverConfig = <ServerConfig>{
  ports: {
    httpPort: 8080,
    httpsPort: 8443,
  },
  sslKeys: {
    key: fs.readFileSync('cert/privkey.pem'),
    cert: fs.readFileSync('cert/cert.pem'),
    ca: fs.readFileSync('cert/chain.pem'),
  }
};
new Server(app, serverConfig).run();
