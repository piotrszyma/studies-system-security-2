import * as crypto from 'crypto';
import BaseScheme from "../BaseScheme";
import { SchemeMethodName } from "../Scheme";
import G1 from "../../algebra/G1";
import Fr from "../../algebra/Fr";
import { hashOf, stringifiedIntHashOf } from "../../crypto/hashers";
import { poly1305mac } from "../../crypto/mackers";
import { serializedSigmaPrivKey, serializedSigmaPubKey } from "../../keys/sigma";
import { createSession } from '../../storage/storage';

function sign(msg: string, serializedPrivateKey): { s: Fr, X: G1 } {
  const a = new Fr(serializedPrivateKey);
  const x = new Fr().random();
  const g = new G1().getG1();

  const X = g.mul(x);
  const msgHash = stringifiedIntHashOf(msg + X.serialize());
  const c = new Fr();
  c.mcl().setStr(msgHash);

  const ac = a.mul(c);
  const s = ac.add(x);

  return { s, X };
}

export default class SigmaKeyExchangeScheme extends BaseScheme {
  getName() {
    return 'sigma';
  }

  getSupportedMethods() {
    return new Set(['init', 'exchange']);
  }

  getMethod(methodName: SchemeMethodName) {
    switch (methodName) {
      case 'init':
        return this.init;
      case 'exchange':
        return this.exchange;
      default:
        return super.getMethod(methodName);
    }
  }

  async init(params: Object): Promise<Object> {
    const X = new G1(params['payload']['X']);
    const y = new Fr().random();
    const g = new G1().getG1();
    const Y = g.mul(y);

    const key = X.mul(y);
    const macKey = hashOf(`mac_${key.serialize()}`);
    const mac = poly1305mac(serializedSigmaPubKey, macKey);

    const msgToSign = X.serialize() + Y.serialize();
    const signature = sign(msgToSign, serializedSigmaPrivKey);

    const sessionToken = createSession({
      'X': X.serialize(),
      'Y': Y.serialize(),
      'y': y.serialize(),
    });

    return {
      'session_token': sessionToken,
      'payload': {
        'b_mac': mac.serialize(),
        'B': serializedSigmaPubKey,
        'Y': Y.serialize(),
        'sig': {
          'X': signature.X,
          's': signature.s,
          'msg': msgToSign,
        }
      }
    };
  }

  async exchange(params: Object): Promise<Object> {
    return {};
  }
}