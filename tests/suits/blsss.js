const mcl = require('mcl-wasm');
const { randomBytes } = require('crypto');
const axios = require('axios');

const config = require('../config');

const PORT = config.testedPort;
const ADDRESS = config.testedAddress;

const CONST_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
}

const CONST_R = config.consts.r;

async function performVerifyRequest(data) {
  try {
    const response = await axios.post(`https://${ADDRESS}:${PORT}/protocols/blsss/verify`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

async function testVerifiesValidMessage() {
  await mcl.init(mcl.BLS12_381);

  const g1 = new mcl.G1();
  g1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);

  const randomR = (BigInt(`0x${randomBytes(128).toString("hex")}`) % BigInt(CONST_R));
  // Prover generates random x.
  const x = new mcl.Fr();
  x.setStr(randomR.toString(16), 16);

  const A = mcl.mul(g1, x);
  const message = 'test';
  const hash = mcl.hashAndMapToG2(message);
  const sigma = mcl.mul(hash, x); // G2

  const verifyData = await performVerifyRequest({
    'payload': {
      'A': A.getStr(10).slice(2),
      'sigma': sigma.getStr(10).slice(2),
      'msg': message,
    },
    'protocol_name': 'blsss',
  });

  if (!verifyData.valid) {
    throw 'testVerifiesValidMessage failed'
  }
}

async function main() {
  await testVerifiesValidMessage();
}

main();