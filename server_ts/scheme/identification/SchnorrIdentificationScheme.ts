import IdentificationScheme from "./IdentificationScheme";
import { SchemeName, SchemeMethod, SchemeMethodName } from "../Scheme";


export default class SchnorrIdentificationScheme extends IdentificationScheme {

  getName(): SchemeName {
    return 'sis';
  }

  getMethod(name: SchemeMethodName): SchemeMethod {
    switch (name) {
      case 'init':
        return this.init;
      case 'verify':
        return this.verify;
      default:
        return super.getMethod(name);
    }
  }

  init(params: Object): Object {
    return {};
  }

  verify(params: Object): Object {
    return {};
  }

}