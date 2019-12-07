import IdentificationScheme from "./IdentificationScheme";
import { SchemeName, SchemeMethod, SchemeMethodName } from "../Scheme";
import Fr from "../../algebra/Fr";
import G1 from "../../algebra/G1";
import G2 from "../../algebra/G2";
import { createSession, getSessionByToken } from "../../storage/storage";


export default class OkamotoIdentificationScheme extends IdentificationScheme {

  getName(): SchemeName {
    return 'ois';
  }

  async verify(params: Object): Promise<Object> {
    const sessionToken = params['session_token'];
    const sessionParams = await getSessionByToken(sessionToken);

    const s1 = new Fr(params['payload']['s1']);
    const s2 = new Fr(params['payload']['s2']);
    const c = new Fr(sessionParams['c']);
    const X = new G1(sessionParams['X']);
    const A = new G1(sessionParams['A']);
    const g1 = new G1().getG1();
    const g2 = new G1().getG2();

    const g1s1 = g1.mul(s1);
    const g2s2 = g2.mul(s2);
    const g1s1g2s2 = g1s1.add(g2s2);

    const Ac = A.mul(c);
    const XAc = X.add(Ac);

    return {
      verified: XAc.mcl().getStr(10) == g1s1g2s2.mcl().getStr(10),
    };
  }

}