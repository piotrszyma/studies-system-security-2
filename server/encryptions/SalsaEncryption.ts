const _sodium = require('libsodium-wrappers');
import { Encryption, EncryptionName } from "./Encryption";
import { salsaKey } from "../keys/salsa";

export default class SalsaEncryption implements Encryption {
  getName(): EncryptionName {
    return 'salsa';
  }

  async encrypt(params: Object): Promise<Object> {
    await _sodium.ready;
    const sodium = _sodium;
    const msg = JSON.stringify(params);
    const responseNonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const responseCiphertext = sodium.crypto_secretbox_easy(
      msg, responseNonce, salsaKey);
    return {
      ciphertext: sodium.to_base64(responseCiphertext, sodium.base64_variants.ORIGINAL),
      nonce: sodium.to_base64(responseNonce, sodium.base64_variants.ORIGINAL),
    };
  }

  async decrypt(params: Object): Promise<Object> {
    await _sodium.ready;
    const sodium = _sodium;
    const ciphertext = new Uint8Array(Buffer.from(params['ciphertext'], 'base64'));
    const requestNonce = new Uint8Array(Buffer.from(params['nonce'], 'base64'));
    const decrypted = sodium.crypto_secretbox_open_easy(ciphertext, requestNonce, salsaKey);
    return JSON.parse(Buffer.from(decrypted).toString());
  }
}