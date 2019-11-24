export default class ServerOptions {
  private httpPort: number;
  private httpsPort: number;

  constructor(
    httpPort: number,
    httpsPort: number,

  ) {
    this.httpPort = httpPort;
    this.httpsPort = httpsPort;
  }

  getHttpPort(): number {
    return this.httpPort;
  }

  getHttpsPort(): number {
    return this.httpsPort;
  }
}