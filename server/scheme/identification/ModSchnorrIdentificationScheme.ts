import IdentificationScheme from "./IdentificationScheme";

import Fr from "../../algebra/Fr";
import G1 from "../../algebra/G1";
import G2 from "../../algebra/G2";

import { SchemeName } from "../Scheme";
import { getSessionByToken } from "../../storage/storage";


export default class ModSchnorrIdentificationScheme extends IdentificationScheme {

  getName(): SchemeName {
    return 'msis';
  }

  async verify(params: Object): Promise<Object> {
    const sessionToken = params['session_token'];
    const sessionParams = await getSessionByToken(sessionToken);

    const c = new Fr(sessionParams['c']);
    const X = new G1(sessionParams['X']);
    const A = new G1(sessionParams['A']);
    const g = new G1().getG1();

    const s = new G2(params['payload']['S']);

    const gHat = new G2().hashAndMapTo(X.serialize() + c.serialize());

    const Ac = A.mul(c);
    const XAc = X.add(Ac);

    const e1 = g.pairing(s);
    const e2 = XAc.pairing(gHat);

    return {
      verified: e1.getStr() === e2.getStr(),
    };
  }
}