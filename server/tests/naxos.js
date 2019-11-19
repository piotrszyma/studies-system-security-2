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

async function requestServerPublicKey() {
  try {
    const response = await axios.post(`https://${ADDRESS}:${PORT}/protocols/naxos/pkey`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}


async function requestKeyExchange(data) {
  try {
    const response = await axios.post(`https://${ADDRESS}:${PORT}/protocols/naxos/exchange`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

async function performValidExchange() {
  await mcl.init(mcl.BLS12_381);

  const g = new mcl.G1();
  g.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);

  const pkeyData = await requestServerPublicKey();
  const pubB = new mcl.G1();
  pubB.setStr(`1 ${pkeyData.B}`);

  const skA = new mcl.Fr(); skA.setByCSPRNG();
  const pubA = mcl.mul(g, skA);

  const msg = 'test';
  const eskA = (BigInt(`0x${randomBytes(~~(111 / 8) + 1).toString("hex")}`)).toString(10); // Server returns to client in response
  const X = mcl.mul(g, mclUtils.hashFr(eskB + skB.getStr(10)));


  const response = await requestKeyExchange({
    X,
    A: pubA,
    msg,
  })

  const Y = new mcl.G1();
  Y.setStr(`1 ${response.data.Y}`);

  const serverMsg = msg;

}


function main() {
  await performValidExchange();
}

main();