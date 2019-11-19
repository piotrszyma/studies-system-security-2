const crypto = require('crypto');
const mcl = require('mcl-wasm');

const config = require('../config');

function getGenG1() {
  const generator = new mcl.G1();
  generator.setStr(`1 ${config.points.g1.x} ${config.points.g1.y}`);
  return generator;
}

function getGenG2() {
  const generator = new mcl.G1();
  generator.setStr(`1 ${config.points.g2.x} ${config.points.g2.y}`);
  return generator;
}


function serializeFr(value) {
  return value.getStr(10);
};

function deserializeFr(value) {
  const fr = new mcl.Fr();
  fr.setStr(value);
  return fr;
};

function serializeG1(value) {
  return value.getStr(10).slice(2);
};

function serializeG2(value) {
  return value.getStr(10).slice(2);
}

function deserializeG1(value) {
  const g1 = new mcl.G1();
  g1.setStr(`1 ${value}`);
  return g1;
};

function deserializeG2(value) {
  const g2 = new mcl.G2();
  g2.setStr(`1 ${value}`);
  return g2;
}

function tryDeserializeG2(serialized) {
  try {
    return deserializeG2(serialized);
  } catch {
    throw new Error("Invalid serialized G2 value.");
  }
}

function tryDeserializeG1(serialized) {
  try {
    return deserializeG1(serialized);
  } catch {
    throw new Error("Invalid serialized G1 value.");
  }
}

function tryDeserializeFr(serialized) {
  try {
    return deserializeFr(serialized);
  } catch {
    throw new Error("Invalid serialized Fr value.");
  }
}

function hashFr(value) {
  const hasher = crypto.createHash('sha3-512');
  hasher.update(value);
  const msgHash = hasher.digest('hex');
  const r = BigInt(config.consts.r);
  const hashInt = BigInt('0x' + msgHash);
  c = new mcl.Fr();
  c.setStr((hashInt % r).toString());
  return c;
}

function hash(value) {
  const hasher = crypto.createHash('sha3-512');
  hasher.update(value);
  const msgHash = hasher.digest('hex');
  const r = BigInt(config.consts.r);
  const hashInt = BigInt('0x' + msgHash);
  const intValue = (hashInt % r).toString();
  return intValue;
}

function hashHex(value) {
  const hasher = crypto.createHash('sha3-512');
  hasher.update(value);
  return hasher.digest('hex');
}

module.exports = {
  tryDeserializeFr,
  tryDeserializeG1,
  tryDeserializeG2,
  getGenG1,
  getGenG2,
  hashHex,
  hashFr,
  hash,
  serializeFr,
  deserializeFr,
  serializeG1,
  deserializeG1,
  serializeG2,
  deserializeG2,
}