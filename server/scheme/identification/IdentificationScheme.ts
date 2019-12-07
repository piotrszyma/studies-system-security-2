import { Scheme, SchemeName, SchemeMethodName, SchemeMethod } from "../Scheme";
import BaseScheme from "../BaseScheme";
import G1 from "../../algebra/G1";
import Fr from "../../algebra/Fr";
import { createSession } from "../../storage/storage";

export default abstract class IdentificationScheme extends BaseScheme {
  abstract getName(): SchemeName;

  getSupportedMethods() {
    return new Set(['init', 'verify']);
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
    const sessionToken = await createSession({
      'X': params['payload']['X'],
      'A': params['payload']['A'],
      'c': c,
    })
    return {
      'session_token': sessionToken,
      'payload': {
        'c': c,
      }
    };
  }

  abstract verify(params: Object): Object;
}