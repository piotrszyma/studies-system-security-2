import SignatureScheme from "./SignatureScheme";
import { SchemeName } from "../Scheme";
import G1 from "../../algebra/G1";
import G2 from "../../algebra/G2";

export default class BLSSignatureScheme extends SignatureScheme {
  getName(): SchemeName {
    return 'blsss';
  }

  async verify(params: Object): Promise<Object> {
    const msg = params['payload']['msg'];
    const hash = new G2().hashAndMapTo(msg);
    const sigma = new G2(params['payload']['sigma']);
    const A = new G1(params['payload']['A']);
    const g = new G1().getG1();
    const e1 = g.pairing(sigma);
    const e2 = A.pairing(hash);
    return {
      valid: e1.getStr() === e2.getStr(),
    }
  }
}