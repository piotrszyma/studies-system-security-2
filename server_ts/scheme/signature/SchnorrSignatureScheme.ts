import SignatureScheme from "./SignatureScheme";
import { SchemeName } from "../Scheme";
import Fr from "../../algebra/Fr";
import G1 from "../../algebra/G1";
import { stringifiedIntHashOf } from "../../crypto/hashers";

export default class SchnorrSignatureScheme extends SignatureScheme {
  getName(): SchemeName {
    return 'sss';
  }

  async verify(params: Object): Promise<Object> {
    const A = new G1(params['payload']['A']);
    const X = new G1(params['payload']['X']);
    const s = new Fr(params['payload']['s']);
    const msg = params['payload']['msg'];

    const c = new Fr().fromHash(stringifiedIntHashOf(msg + X.serialize()));
    const g = new G1().getG1();
    const gs = g.mul(s);
    const Ac = A.mul(c);
    const XAc = X.add(Ac);

    return {
      valid: gs.mcl().getStr() === XAc.mcl().getStr(),
    }
  }
}