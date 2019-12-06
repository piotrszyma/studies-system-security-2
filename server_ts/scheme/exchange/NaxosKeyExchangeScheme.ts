import * as crypto from 'crypto';

import BaseScheme from "../BaseScheme";
import { SchemeMethodName } from "../Scheme";

import G1 from "../../algebra/G1";
import Fr from "../../algebra/Fr";

import { serializedNaxosPubKey, serializedNaxosPrivKey } from "../../keys/naxos";
import { stringifiedIntHashOf } from "../../crypto/hash";
import { randomBitString } from "../../crypto/random";

export default class NaxosKeyExchangeScheme extends BaseScheme {
  getName() {
    return 'naxos';
  }

  getSupportedMethods() {
    return new Set(['pkey', 'exchange']);
  }

  getMethod(methodName: SchemeMethodName) {
    switch (methodName) {
      case 'pkey':
        return this.pkey;
      case 'exchange':
        return this.exchange;
      default:
        return super.getMethod(methodName);
    }
  }

  async pkey(params: Object): Promise<Object> {
    return {
      'B': serializedNaxosPubKey,
    };
  }

  async exchange(params: Object): Promise<Object> {

    const g = new G1().getG1();
    const X = new G1(params['payload']['X']);
    const A = new G1(params['payload']['A']);
    const msg = params['payload']['msg'];

    const eskB = randomBitString(512);
    const skB = new Fr(serializedNaxosPrivKey);

    const Y = g.mul(new Fr().fromHash(stringifiedIntHashOf(eskB + skB.serialize())));

    const pkAH = A.mul(new Fr().fromHash(stringifiedIntHashOf(eskB + skB.serialize())));
    const Xskb = X.mul(skB);
    const XH = X.mul(new Fr().fromHash(stringifiedIntHashOf(eskB + skB.serialize())));

    const serverKey = crypto.createHash('sha3-512').update(
      pkAH.serialize() +
      Xskb.serialize() +
      XH.serialize() +
      A.serialize() +
      serializedNaxosPubKey
    ).digest();

    const msgArray = new Uint8Array(Buffer.from(msg));

    const hashWithMsg = new Uint8Array(serverKey.length + msgArray.length);
    hashWithMsg.set(serverKey);
    hashWithMsg.set(msgArray, serverKey.length);

    const msgHash = crypto.createHash('sha3-512');
    const hashOfMsg = msgHash.update(hashWithMsg).digest('base64');

    return {
      'Y': Y.serialize(),
      'msg': hashOfMsg,
    };
  }
}