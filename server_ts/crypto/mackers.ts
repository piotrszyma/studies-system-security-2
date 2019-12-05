import * as chacha from 'chacha';

export function poly1305mac(value: string, key: Buffer) {
  const cipherFactory = chacha.createHmac(key);
  cipherFactory.update(value);
  return cipherFactory.digest('base64');
}