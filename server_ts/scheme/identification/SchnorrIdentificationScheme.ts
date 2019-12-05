import IdentificationScheme from "./IdentificationScheme";
import { SchemeName, SchemeMethod, SchemeMethodName } from "../Scheme";
import Fr from "../../algebra/Fr";
import G1 from "../../algebra/G1";
import { createSession, getSessionByToken } from "../../storage/storage";


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

  async verify(params: Object): Promise<Object> {
    const sessionToken = params['session_token'];
    const sessionParams = await getSessionByToken(sessionToken);

    const s = new Fr(params['payload']['s']);
    const c = new Fr(sessionParams['c']);
    const X = new G1(sessionParams['X']);
    const A = new G1(sessionParams['A']);
    const g = new G1().gen();

    const gs = g.mul(s);
    const Ac = A.mul(c);
    const XAc = X.add(Ac);

    return {
      verified: XAc.mcl().getStr(10) == gs.mcl().getStr(10),
    };
  }

}