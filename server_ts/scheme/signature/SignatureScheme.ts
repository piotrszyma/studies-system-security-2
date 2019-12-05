import { Scheme, SchemeName, SchemeMethodName, SchemeMethod } from "../Scheme";
import BaseScheme from "../BaseScheme";

export default abstract class SignatureScheme extends BaseScheme {
  abstract getName(): SchemeName;

  getSupportedMethods() {
    return new Set(['verify']);
  }

  getMethod(name: SchemeMethodName): SchemeMethod {
    switch (name) {
      case 'verify':
        return this.verify;
      default:
        return super.getMethod(name);
    }
  }

  abstract verify(payload: Object): Object;
}