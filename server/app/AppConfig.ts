interface Ports {
  httpPort: number,
  httpsPort: number,
}

interface SslKeys {
  key: Buffer,
  cert: Buffer,
  ca: Buffer,
}

interface AppConfig {
  ports: Ports,
  sslKeys: SslKeys,
  domain: string,
}

export default AppConfig;