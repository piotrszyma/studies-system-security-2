const mcl = require('mcl-wasm');
const axios = require('axios');
const crypto = require('crypto');
const mclUtils = require('../server/crypto/mcl-utils');

const config = require('../config');

const PORT = config.testedPort;
const ADDRESS = config.testedAddress;

const CONST_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
}

async function performVerifyRequest(data) {
  try {
    const response = await axios.post(`https://${ADDRESS}:${PORT}/protocols/sss/verify`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

async function testVerifiesValidMessage() {
  await mcl.init(mcl.BLS12_381);

  const G1 = new mcl.G1();
  G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const a = new mcl.Fr();
  a.setByCSPRNG();
  const x = new mcl.Fr();
  x.setByCSPRNG();

  const A = mcl.mul(G1, a);
  const X = mcl.mul(G1, x);

  const message = 'test';

  const value = message + X.getStr(10).slice(2);
  const hasher = crypto.createHash('sha3-512');
  hasher.update(value);
  const msgHash = hasher.digest('hex');
  const r = BigInt(config.consts.r);
  const hashInt = BigInt('0x' + msgHash);
  const intValue = (hashInt % r).toString();

  const c = new mcl.Fr();
  c.setStr(intValue);

  // s = ac + x

  const ac = mcl.mul(a, c);
  const s = mcl.add(ac, x);

  console.log('r', r);
  console.log('x', mclUtils.serializeFr(x));
  console.log('a', mclUtils.serializeFr(a));
  console.log('X', mclUtils.serializeG1(X));
  console.log('A', mclUtils.serializeG1(A));
  console.log('msg', message);
  console.log('h', intValue);
  console.log('s', s.getStr(10));

  const verifyData = await performVerifyRequest({
    'payload': {
      'A': A.getStr(10).slice(2),
      'X': X.getStr(10).slice(2),
      'msg': message,
      's': s.getStr(10),
    },
    'protocol_name': 'sss',
  });

  console.log(verifyData);

  if (!verifyData.valid) {
    throw 'testVerifiesValidMessage failed'
  }
}
async function testDoesNotVerifyInvalidMessage() {
  await mcl.init(mcl.BLS12_381);
  const G1 = new mcl.G1();
  G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const a = new mcl.Fr();
  a.setByCSPRNG();
  const A = mcl.mul(G1, a);
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const X = mcl.mul(G1, x);

  const verifyData = await performVerifyRequest({
    'payload': {
      'A': A.getStr(10).slice(2),
      'X': X.getStr(10).slice(2),
      'msg': 'foo',
      's': 'a1',
    },
    'protocol_name': 'sss',
  });

  if (verifyData.valid) {
    throw 'testDoesNotVerifyInvalidMessage failed'
  }
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

function getGenG1() {
  const generator = new mcl.G1();
  generator.setStr(`1 ${config.points.g1.x} ${config.points.g1.y}`);
  return generator;
}

async function testManualCheck() {
  await mcl.init(mcl.BLS12_381);

  const data = { "s": "4114369594741764151762242958576205783703308812414145843692224912212669312960", "X": "439132420359944732041934199041796121121775224900245881994221908630457204768078771956440623442563355915663033823408 1786707094151755482393927430230334264333767642487098464595973465638837910974739495628921249964351986083748504307430", "A": "1913351124329040704019586578169075444732594455544821113976778738918542363198609091363477112095879286661912788308362 2799816536234905978788220456813299282290089797649596775899493188467111082486831403737459253452419026918808857468954", "msg": "MY MESSAGE" }
  const serializedS = data["s"];
  const serializedX = data["X"];
  const serializedA = data["A"];
  const msg = data["msg"];

  console.log(`X: ${serializedX}`);
  console.log(`A: ${serializedA}`);
  console.log(`s: ${serializedS}`);

  const s = new mcl.Fr();
  s.setStr(serializedS);
  const A = new mcl.G1();
  A.setStr(`1 ${serializedA}`);
  const X = new mcl.G1();
  X.setStr(`1 ${serializedX}`);

  console.log('input: ' + msg + serializedX);
  console.log('output: ' + hash(msg + serializedX));

  const c = new mcl.Fr();
  c.setStr(hash(msg + serializedX));
  console.log(`c: ${c.getStr(10)}`);

  const g = getGenG1();
  const GS = mcl.mul(g, s);
  const AC = mcl.mul(A, c);
  const XAC = mcl.add(X, AC);
  console.log(`GS: ${GS.getStr(10).slice(2)}`);
  console.log(`AC: ${AC.getStr(10).slice(2)}`);
  console.log(`XAC: ${XAC.getStr(10).slice(2)}`);

  console.log(XAC.serializeToHexStr() === GS.serializeToHexStr());
};

async function main() {
  await testVerifiesValidMessage();
  // await testDoesNotVerifyInvalidMessage();
  // await testManualCheck();
}

main();