import BaseScheme from "../BaseScheme";
import { SchemeMethodName } from "../Scheme";

class NaxosKeyExchangeScheme extends BaseScheme {
  getName() {
    return 'naxos';
  }

  getSupportedMethods() {
    return new Set(['pkey', 'exchange']);
  }

  getMethod(methodName: SchemeMethodName) {
    switch (methodName) {
      case 'pkey':
        return this.pkey;
      case 'exchange':
        return this.exchange;
      default:
        return super.getMethod(methodName);
    }
  }

  async pkey(params: Object): Promise<Object> {
    return {};
  }

  async exchange(params: Object): Promise<Object> {
    return {};
  }
}