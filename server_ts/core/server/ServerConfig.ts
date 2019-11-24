interface Ports {
  httpPort: number,
  httpsPort: number,
}

interface SslKeys {
  key: Buffer,
  cert: Buffer,
  ca: Buffer,
}

interface ServerConfig {
  ports: Ports,
  sslKeys: SslKeys,
}

export default ServerConfig;