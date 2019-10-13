const mcl = require('mcl-wasm');
const axios = require('axios');

const CONST_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
}

const PORT = 3000;

async function performInitRequest(data) {
  try {
    const response = await axios.post(`http://localhost:${PORT}/protocols/sis/init`, data)
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
async function performVerifyRequest(data) {
  try {
    const response = await axios.post(`http://localhost:${PORT}/protocols/sis/verify`, data)
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

async function testPerformValidCommitment() {
  await mcl.init(mcl.BLS12_381);
  const G1 = new mcl.G1();
  G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const a = new mcl.Fr();
  a.setByCSPRNG();
  const A = mcl.mul(G1, a);
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const X = mcl.mul(G1, x);
  const serializedA = A.serializeToHexStr();
  const serializedX = X.serializeToHexStr();

  const initResponseData = await performInitRequest({
    "protocol_name": "sis",
    "payload": {
      "A": serializedA,
      "X": serializedX,
    }
  })

  const serializedC = initResponseData.payload.c;
  const c = mcl.deserializeHexStrToFr(serializedC);
  const ac = mcl.mul(a, c);
  const s = mcl.add(ac, x);

  const verifyResponseData = await performVerifyRequest({
    "protocol_name": "sis",
    "session_token": initResponseData.session_token,
    "payload": {
      "s": s.serializeToHexStr(),
    }
  });

  if (!verifyResponseData.verified) {
    throw "testPerformValidCommitment failed"
  }
}


async function testPerformInvalidCommitment() {
  await mcl.init(mcl.BLS12_381);
  const G1 = new mcl.G1();
  G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const a = new mcl.Fr();
  a.setByCSPRNG();
  const A = mcl.mul(G1, a);
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const X = mcl.mul(G1, x);
  const serializedA = A.serializeToHexStr();
  const serializedX = X.serializeToHexStr();

  const initResponseData = await performInitRequest({
    "protocol_name": "sis",
    "payload": {
      "A": serializedA,
      "X": serializedX,
    }
  })

  const random = new mcl.Fr();
  random.setByCSPRNG();
  const verifyResponseData = await performVerifyRequest({
    "protocol_name": "sis",
    "session_token": initResponseData.session_token,
    "payload": {
      "s": random.serializeToHexStr(),
    }
  });
  if (verifyResponseData.verified) {
    throw "testPerformInvalidCommitment failed"
  }
}

async function testVerifyInvalidSessionToken() {
  const responseData = await performVerifyRequest({
    "protocol_name": "sis",
    "session_token": 'invalid token',
    "payload": {
      "s": 'lorem ipsum',
    }
  });

  if (responseData.message !== 'Invalid session_token.') {
    throw "testInvalidSessionId failed"
  }
}


async function testInitInvalidA() {
  await mcl.init(mcl.BLS12_381);
  const G1 = new mcl.G1();
  G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const X = mcl.mul(G1, x);
  const serializedX = X.serializeToHexStr();

  const initResponseData = await performInitRequest({
    "protocol_name": "sis",
    "payload": {
      "A": 'invalid serialized a',
      "X": serializedX,
    }
  })

  if (initResponseData.message !== 'Invalid serialized A.') {
    throw "testPerformInvalidSerializedA failed"
  }
}

async function testInitInvalidX() {
  await mcl.init(mcl.BLS12_381);
  const G1 = new mcl.G1();
  G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const a = new mcl.Fr();
  a.setByCSPRNG();
  const A = mcl.mul(G1, a);
  const serializedA = A.serializeToHexStr();


  const initResponseData = await performInitRequest({
    "protocol_name": "sis",
    "payload": {
      "A": serializedA,
      "X": 'invalid serialized x',
    }
  })

  if (initResponseData.message !== 'Invalid serialized X.') {
    throw "testPerformInvalidSerializedX failed"
  }
}


async function main() {
  await testPerformInvalidCommitment();
  await testPerformValidCommitment();
  await testVerifyInvalidSessionToken();
  await testInitInvalidA();
  await testInitInvalidX();
}

main();