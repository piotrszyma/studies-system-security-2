const mcl = require('mcl-wasm');
const axios = require('axios');
const crypto = require('crypto');

const PORT = 3000;

const CONST_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
}

const CONST_R = '0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001';

function getHash(value) {
  const hasher = crypto.createHash('sha3-256');
  hasher.update(value);
  return hasher.digest('hex');
}

async function performVerifyRequest(data) {
  try {
    const response = await axios.post(`http://localhost:${PORT}/protocols/sss/verify`, data)
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
  const A = mcl.mul(G1, a);
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const X = mcl.mul(G1, x);

  const r = BigInt(CONST_R);

  const message = 'test';

  const msgHash = getHash(message + X.getStr(16));
  const hashInt = BigInt('0x' + msgHash);

  c = new mcl.Fr();
  c.setStr((hashInt % r).toString());

  const ac = mcl.mul(a, c);
  const s = mcl.add(ac, x);

  const verifyData = await performVerifyRequest({
    'payload': {
      'A': A.getStr(10).slice(2),
      'X': X.getStr(10).slice(2),
      'msg': message,
      's': s.getStr(10),
    },
    'protocol_name': 'sss',
  });

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

async function main() {
  await testVerifiesValidMessage();
  await testDoesNotVerifyInvalidMessage();
}

main();