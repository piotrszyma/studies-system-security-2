import * as crypto from 'crypto';
import BaseScheme from "../BaseScheme";
import { SchemeMethodName } from "../Scheme";
import G1 from "../../algebra/G1";
import Fr from "../../algebra/Fr";
import { hashOf, stringifiedIntHashOf } from "../../crypto/hash";
import { macPoly1305 } from "../../crypto/mac";
import { SIGMA_PRIVKEY, SIGMA_PUBKEY } from "../../keys/sigma";
import { createSession, getSessionByToken } from '../../storage/storage';
import SchnorrSignatureScheme from '../signature/SchnorrSignatureScheme';

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
    const mac = macPoly1305(SIGMA_PUBKEY, macKey);

    const msgToSign = X.serialize() + Y.serialize();
    const signature = sign(msgToSign, SIGMA_PRIVKEY);

    const sessionToken = await createSession({
      'X': X.serialize(),
      'y': y.serialize(),
    });

    return {
      'session_token': sessionToken,
      'payload': {
        'b_mac': mac,
        'B': SIGMA_PUBKEY,
        'Y': Y.serialize(),
        'sig': {
          'X': signature.X.serialize(),
          's': signature.s.serialize(),
          'msg': msgToSign,
        }
      }
    };
  }

  async exchange(params: Object): Promise<Object> {
    const macOfA = params['payload']['a_mac'];
    const A = new G1(params['payload']['A']);
    const msg = params['payload']['msg'];
    const sessionToken = params['session_token'];
    const signature = params['payload']['sig'];

    const response = await new SchnorrSignatureScheme().verify({
      'payload': {
        X: signature['X'],
        A: A.serialize(),
        s: signature['s'],
        msg: signature['msg'],
      }
    })

    if (!response['valid']) throw Error("Signature is not valid");

    const sessionParams = await getSessionByToken(sessionToken);
    const X = new G1(sessionParams['X']);
    const y = new Fr(sessionParams['y']);

    const sessionKey = hashOf(`session_${X.mul(y).serialize()}`);
    const msgArray = new Uint8Array(Buffer.from(msg));
    const sessionMsgArray = new Uint8Array(sessionKey.length + msgArray.length);
    sessionMsgArray.set(sessionKey);
    sessionMsgArray.set(msgArray, sessionKey.length);

    const encMsg = crypto.createHash('sha3-512').update(sessionMsgArray).digest('base64');

    return {
      'msg': encMsg
    };
  }
}