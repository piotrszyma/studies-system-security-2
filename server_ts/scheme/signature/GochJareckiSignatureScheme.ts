import SignatureScheme from "./SignatureScheme";
import { SchemeName } from "../Scheme";
import G1 from "../../algebra/G1";
import Fr from "../../algebra/Fr";
import { stringifiedIntHashOf } from "../../crypto/hashers";

export default class GochJareckiSignatureScheme extends SignatureScheme {
  getName(): SchemeName {
    return 'gjss';
  }

  async verify(params: Object): Promise<Object> {
    const msg = params['payload']['msg'];
    const A = new G1(params['payload']['A']);
    const s = new Fr(params['payload']['sigma']['s']);
    const c = new Fr(params['payload']['sigma']['c']);
    const r = new Fr(params['payload']['sigma']['r']);
    const z = new G1(params['payload']['sigma']['z']);
    const g = new G1().getG1();

    const hPrim = new G1().hashAndMapTo(msg + r.serialize());
    const uPrim = g.mul(s).add(A.mul(c.neg()));
    const vPrim = hPrim.mul(s).add(z.mul(c.neg()));

    const cPrim = new Fr().fromHash(stringifiedIntHashOf(
      g.serialize() +
      hPrim.serialize() +
      A.serialize() +
      z.serialize() +
      uPrim.serialize() +
      vPrim.serialize()
    ))


    return {
      verified: cPrim.equals(c),
    }
  }
}