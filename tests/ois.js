const mcl = require('mcl-wasm');
const axios = require('axios');

const config = require('../config');

const CONST_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
}

const CONST_G2 = {
  x: '2144250947445192081071618466765046647019257686245947349033844530891338159027816696711238671324221321317530545114427',
  y: '2665798332422762660334686159210698639947668680862640755137811598895238932478193747736307724249253853210778728799013',
}

const ADDRESS = config.testedAddress;
const PORT = config.testedPort;

const LOGGER = false;

async function performInitRequest(data) {
  try {
    if (LOGGER) console.log(data);
    const response = await axios.post(`https://${ADDRESS}:${PORT}/protocols/ois/init`, data);
    if (LOGGER) console.log(response.data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

async function performVerifyRequest(data) {
  try {
    if (LOGGER) console.log(data);
    const response = await axios.post(`https://${ADDRESS}:${PORT}/protocols/ois/verify`, data);
    if (LOGGER) console.log(response.data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}


async function testPerformValidCommitment() {
  await mcl.init(mcl.BLS12_381);
  const g1 = new mcl.G1();
  g1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const g2 = new mcl.G1();
  g2.setStr(`1 ${CONST_G2.x} ${CONST_G2.y}`);

  const a1 = new mcl.Fr();
  a1.setByCSPRNG();
  const a2 = new mcl.Fr();
  a2.setByCSPRNG();
  const A = mcl.add(mcl.mul(g1, a1), mcl.mul(g2, a2));

  const x1 = new mcl.Fr();
  x1.setByCSPRNG();
  const x2 = new mcl.Fr();
  x2.setByCSPRNG();
  const X = mcl.add(mcl.mul(g1, x1), mcl.mul(g2, x2));

  const serializedA = A.getStr(10).slice(2);
  const serializedX = X.getStr(10).slice(2);

  const initResponseData = await performInitRequest({
    "protocol_name": "ois",
    "payload": {
      "A": serializedA,
      "X": serializedX,
    }
  })

  const serializedC = initResponseData.payload.c;
  const c = new mcl.Fr();
  c.setStr(serializedC);

  const s1 = mcl.add(x1, mcl.mul(a1, c));
  const s2 = mcl.add(x2, mcl.mul(a2, c));

  const verifyResponseData = await performVerifyRequest({
    "protocol_name": "ois",
    "session_token": initResponseData.session_token,
    "payload": {
      "s1": s1.getStr(10),
      "s2": s2.getStr(10),
    }
  });

  console.log(verifyResponseData);
  if (!verifyResponseData.verified) {
    console.error("testPerformValidCommitment failed");
  }
}
async function main() {
  // await testPerformInvalidCommitment();
  await testPerformValidCommitment();

  // await testInitInvalidA();
  // await testInitInvalidX();
  // await testInitInvalidProtocolName();

  // await testVerifyInvalidSessionToken();
  // await testVerifyInvalidS();
  // await testVerifyInvalidProtocolName();

  // await testApiCheckWorks();
}

main();