import * as fs from 'fs';

import AppConfig from './app/AppConfig';
import AppServer from './app/AppServer';
import App from './app/App';

const config = <AppConfig>{
  ports: {
    httpPort: 8080,
    httpsPort: 8443,
  },
  sslKeys: {
    key: fs.readFileSync('cert/privkey.pem'),
    cert: fs.readFileSync('cert/cert.pem'),
    ca: fs.readFileSync('cert/chain.pem'),
  },
  domain: 'localhost',
};

new AppServer(new App(), config).run();