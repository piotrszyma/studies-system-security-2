const crypto = require('crypto');

const mcl = require('mcl-wasm');

const { CONST_G1, CONST_R } = require('../consts.js');


function getGroupGenerator() {
  const G1 = new mcl.G1();
  G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  return G1;
}

function getRandomFr() {

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

function deserializeG1(value) {
  const g1 = new mcl.G1();
  g1.setStr(`1 ${value}`);
  return g1;
};

function tryDeserializeG1(serialized) {
  try {
    return deserializeG1(serialized);
  } catch {
    console.log('deserializeG1 failed.')
    return undefined;
  }
}

function tryDeserializeFr(serialized) {
  try {
    return deserializeFr(serialized);
    console.log('deserializeFr failed.')
  } catch {
    return undefined;
  }
}

function hashFr(value) {
  const hasher = crypto.createHash('sha3-256');
  hasher.update(value);
  const hexHash = hasher.digest('hex');
  const bigIntHash = BigInt('0x' + hexHash);
  const hashFr = new mcl.Fr();
  const modulus = BigInt(CONST_R);
  hashFr.setStr((bigIntHash % modulus).toString());
  return hashFr;
}

module.exports = {
  tryDeserializeFr,
  tryDeserializeG1,
  getGroupGenerator,
  hashFr,
  serializeFr,
  deserializeFr,
  serializeG1,
  deserializeG1,
}