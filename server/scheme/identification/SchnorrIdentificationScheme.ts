import IdentificationScheme from "./IdentificationScheme";
import { SchemeName, SchemeMethod, SchemeMethodName } from "../Scheme";
import Fr from "../../algebra/Fr";
import G1 from "../../algebra/G1";
import { createSession, getSessionByToken } from "../../storage/storage";


export default class SchnorrIdentificationScheme extends IdentificationScheme {

  getName(): SchemeName {
    return 'sis';
  }

  async verify(params: Object): Promise<Object> {
    const sessionToken = params['session_token'];
    const sessionParams = await getSessionByToken(sessionToken);

    const s = new Fr(params['payload']['s']);
    const c = new Fr(sessionParams['c']);
    const X = new G1(sessionParams['X']);
    const A = new G1(sessionParams['A']);
    const g = new G1().getG1();

    const gs = g.mul(s);
    const Ac = A.mul(c);
    const XAc = X.add(Ac);

    return {
      verified: XAc.equals(gs),
    };
  }

}