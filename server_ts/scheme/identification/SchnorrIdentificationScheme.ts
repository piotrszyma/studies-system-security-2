import IdentificationScheme from "./IdentificationScheme";
import { SchemeName, SchemeMethod, SchemeMethodName } from "../Scheme";
import Fr from "../../algebra/Fr";
import G1 from "../../algebra/G1";


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

  async init(params: Object): Promise<Object> {
    new G1(params['payload']['X']);
    new G1(params['payload']['A']);
    const c = new Fr().random().serialize();
    return {
      'session_token': '1234',
      'payload': {
        'c': c,
      }
    };
  }

  verify(params: Object): Object {
    return {};
  }

}