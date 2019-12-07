const mcl = require('mcl-wasm');
const { randomBytes } = require('crypto');
const axios = require('axios');
const mclUtils = require('../crypto/mcl-utils');

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
    const response = await axios.get(`https://${ADDRESS}:${PORT}/protocols/naxos/pkey`);
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

  const pubKey = await requestServerPublicKey();
  const pubB = new mcl.G1();
  pubB.setStr(`1 ${pubKey.B}`);

  const skA = new mcl.Fr(); skA.setByCSPRNG();
  const pubA = mcl.mul(g, skA);

  const msg = 'test';

  // const eskA = (BigInt(`0x${randomBytes(~~(111 / 8) + 1).toString("hex")}`)).toString(10); // Server returns to client in response

  const eskA = Array.from({ length: 111 }).map(_ => (~~(Math.random() * 10)) % 2).join('')

  const X = mcl.mul(g, mclUtils.hashFr(eskA + skA.getStr(10)));

  const response = await requestKeyExchange({
    payload: {
      X: X.getStr().slice(2),
      A: pubA.getStr().slice(2),
      msg,
    },
    protocol_name: 'naxos'
  })

  const Y = new mcl.G1(); Y.setStr(`1 ${response.Y}`);
  const serverHash = response.msg;

  const clientKey = mclUtils.hash(
    mcl.mul(Y, skA).getStr(10).slice(2) +
    mcl.mul(pubB, mclUtils.hashFr(eskA + skA.getStr(10))).getStr(10).slice(2) +
    mcl.mul(Y, mclUtils.hashFr(eskA + skA.getStr(10))).getStr(10).slice(2) +
    response.A +
    pubKey
  );

  const verificationHash = Buffer.from(mclUtils.hash(clientKey + msg)).toString('base64');

  if (verificationHash !== serverHash) {
    throw 'naxos exchange failed'
  }
}


async function main() {
  await performValidExchange();
}

main();