import * as crypto from 'crypto';

const R = '0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001';

/**
 * Creates a string of int modulo R of BigInt from sha3-512 hash.
 */
export function stringifiedIntHashOf(value: string): string {
  const hasher = crypto.createHash('sha3-512');
  hasher.update(value);
  const msgHash = hasher.digest('hex');
  const r = BigInt(R);
  const hashInt = BigInt('0x' + msgHash);
  const stringifiedIntValue = (hashInt % r).toString();
  return stringifiedIntValue;
}

export function hashOf(value: string, mode = 'sha3-256') {
  const hasher = crypto.createHash(mode);
  hasher.update(value);
  return hasher.digest();
}

