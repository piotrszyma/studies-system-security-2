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

  const serializedA = A.getStr(10).slice(2);
  const serializedX = X.getStr(10).slice(2);

  const initResponseData = await performInitRequest({
    "protocol_name": "sis",
    "payload": {
      "A": serializedA,
      "X": serializedX,
    }
  })

  const serializedC = initResponseData.payload.c;
  const c = new mcl.Fr();
  c.setStr(serializedC);

  const ac = mcl.mul(a, c);
  const s = mcl.add(ac, x);

  const verifyResponseData = await performVerifyRequest({
    "protocol_name": "sis",
    "session_token": initResponseData.session_token,
    "payload": {
      "s": s.getStr(10),
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
  const serializedA = A.getStr(10).slice(2);
  const serializedX = X.getStr(10).slice(2);

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
  const serializedX = X.getStr(10).slice(2);

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
  const serializedA = A.getStr(10).slice(2);

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

async function testInitInvalidProtocolName() {

  const initResponseData = await performInitRequest({
    "protocol_name": "non sis",
    "payload": {
      "A": 'foo',
      "X": 'bar',
    }
  })

  if (initResponseData.message !== "This endpoint accepts only 'sis' protocol.") {
    throw "testInitInvalidProtocolName failed"
  }
}

async function testVerifyInvalidS() {

  await mcl.init(mcl.BLS12_381);
  const G1 = new mcl.G1();
  G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const a = new mcl.Fr();
  a.setByCSPRNG();
  const A = mcl.mul(G1, a);
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const X = mcl.mul(G1, x);
  const serializedA = A.getStr(10).slice(2);
  const serializedX = X.getStr(10).slice(2);

  const initResponseData = await performInitRequest({
    "protocol_name": "sis",
    "payload": {
      "A": serializedA,
      "X": serializedX,
    }
  })

  const verifyResponseData = await performVerifyRequest({
    "protocol_name": "sis",
    "session_token": initResponseData.session_token,
    "payload": {
      "s": 'invalid s',
    }
  });
  if (verifyResponseData.message !== 'Invalid serialized s.') {
    throw "testVerifyInvalidS failed"
  }
}

async function testVerifyInvalidProtocolName() {
  const verifyResponseData = await performVerifyRequest({
    "protocol_name": "not sis",
    "session_token": 'foo',
    "payload": {
      "s": 'foo',
    }
  });
  if (verifyResponseData.message !== "This endpoint accepts only 'sis' protocol.") {
    throw "testVerifyInvalidProtocolName failed"
  }
}

async function testApiCheckWorks() {
  const response = await axios.post(`http://localhost:${PORT}/protocols/loremipsum/init`)
  if (response.data.message !== 'not found') {
    throw 'testApiCheckWorks failed'
  }
}
async function main() {
  await testPerformInvalidCommitment();
  await testPerformValidCommitment();

  await testInitInvalidA();
  await testInitInvalidX();
  await testInitInvalidProtocolName();

  await testVerifyInvalidSessionToken();
  await testVerifyInvalidS();
  await testVerifyInvalidProtocolName();

  await testApiCheckWorks();

}

main();