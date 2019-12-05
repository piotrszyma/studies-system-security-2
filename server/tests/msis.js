const mcl = require('mcl-wasm');
const axios = require('axios');

const config = require('../config');

const CONST_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
}

const PORT = config.testedPort;
const ADDRESS = config.testedAddress;

const LOGGER = false;

async function performInitRequest(data) {
  try {
    if (LOGGER) console.log(data);
    const response = await axios.post(`https://${ADDRESS}:${PORT}/protocols/msis/init`, data);
    if (LOGGER) console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
}
async function performVerifyRequest(data) {
  try {
    if (LOGGER) console.log(data);
    const response = await axios.post(`https://${ADDRESS}:${PORT}/protocols/msis/verify`, data);
    if (LOGGER) console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
}

async function testPerformValidCommitment() {
  await mcl.init(mcl.BLS12_381);

  // Client generates Q, a, x, calculates A, X and sends them to server.
  const g1 = new mcl.G1();
  g1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const a = new mcl.Fr();
  a.setByCSPRNG();
  const A = mcl.mul(g1, a);
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const X = mcl.mul(g1, x);

  // Get c from server
  const serializedA = A.getStr(10).slice(2);
  const serializedX = X.getStr(10).slice(2);

  const initResponseData = await performInitRequest({
    "protocol_name": "msis",
    "payload": {
      "A": serializedA,
      "X": serializedX,
    }
  });

  const serializedC = initResponseData.payload.c;
  const c = new mcl.Fr();
  c.setStr(serializedC);

  // Client receives c, calculates S, gHat and sends S to server.
  const gHat = mcl.hashAndMapToG2(X.getStr(10).slice(2) + c.getStr(10));

  console.log('gHat', gHat.getStr(10));

  const S = mcl.mul(gHat, mcl.add(x, mcl.mul(a, c)));

  console.log(S);

  const verifyResponseData = await performVerifyRequest({
    "protocol_name": "msis",
    "session_token": initResponseData.session_token,
    "payload": {
      "S": S.getStr(10).slice(2),
    }
  });

  if (!verifyResponseData.verified) {
    throw "testPerformValidCommitment failed"
  }
}

async function main() {
  await testPerformValidCommitment();
}

main();