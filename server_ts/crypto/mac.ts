import * as chacha from 'chacha';

export function macPoly1305(value: string, key: Buffer) {
  const cipherFactory = chacha.createHmac(key);
  cipherFactory.update(value);
  return cipherFactory.digest('base64');
}