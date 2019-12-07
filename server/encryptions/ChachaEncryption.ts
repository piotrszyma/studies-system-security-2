import * as crypto from 'crypto';
import * as chacha from 'chacha';

import { Encryption, EncryptionName } from "./Encryption";
import { chachaKey } from '../keys/chacha';

export default class ChachaEncryption implements Encryption {
  getName(): EncryptionName {
    return 'chacha';
  }

  async encrypt(params: Object) {
    const msg = JSON.stringify(params);
    const responseNonce = crypto.randomBytes(12);
    const cipherFactory = chacha.createCipher(chachaKey, responseNonce);
    const responseCiphertext = cipherFactory.update(msg, 'utf8');
    await cipherFactory.final();
    const tag = cipherFactory.getAuthTag();
    return {
      ciphertext: responseCiphertext.toString('base64'),
      nonce: responseNonce.toString('base64'),
      tag: tag.toString('base64'),
    };
  }

  async decrypt(params: Object) {
    const ciphertext = Buffer.from(params['ciphertext'], 'base64');
    const requestNonce = Buffer.from(params['nonce'], 'base64');
    const decipherFactory = crypto.createDecipheriv(
      'chacha20-poly1305', chachaKey, requestNonce);
    const decrypted = decipherFactory.update(ciphertext);
    const data = JSON.parse(decrypted.toString());
    return data;
  }
}