import Server from "./core/server/Server";
import ServerConfig from "./core/server/ServerConfig";
import app from "./core/app/app";

const serverConfig = new ServerConfig(8080, 8443);
new Server(app, serverConfig).run();
