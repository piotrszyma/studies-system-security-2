const mcl = require('mcl-wasm');
const _sodium = require('libsodium-wrappers');
const axios = require('axios');
const crypto = require('crypto');
const config = require('../../config');
const fs = require('fs');

const SODIUM_KEY = fs.readFileSync('../../keys/salsa_key.bin');

const PORT = config.testedPort;
const ADDRESS = config.testedAddress;

const CONST_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
}

async function performVerifyRequest(data) {
  await _sodium.ready;
  const sodium = _sodium;


  // let res = sodium.crypto_secretstream_xchacha20poly1305_init_push(SODIUM_KEY);
  let key = sodium.crypto_secretstream_xchacha20poly1305_keygen();
  console.log(key.length);
  console.log(SODIUM_KEY.length);
  // let res = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
  // let [state_out, header] = [res.state, res.header];

  try {
    const response = await axios.post(`https://${ADDRESS}:${PORT}/protocols/sss/verify`, data);
    return response.data;
  } catch (error) {
    console.log(error);
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

  const verifyData = await performVerifyRequest({
    'payload': {
      'A': A.getStr(10).slice(2),
      'X': X.getStr(10).slice(2),
      'msg': message,
      's': s.getStr(10),
    },
    'protocol_name': 'sss',
  });

  // console.log(verifyData);

  if (!verifyData.valid) {
    throw 'testVerifiesValidMessage failed'
  }
}

async function main() {
  await testVerifiesValidMessage();
}

main();