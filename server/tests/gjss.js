const mcl = require('mcl-wasm');
const { randomBytes } = require('crypto');
const axios = require('axios');
const mclUtils = require('../crypto/mcl-utils.js');
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
    const response = await axios.post(`https://${ADDRESS}:${PORT}/protocols/gjss/verify`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

async function testVerifiesValidMessage() {
  await mcl.init(mcl.BLS12_381);

  // Key Generation
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const g = mclUtils.getGenG1(); // G1
  const A = mcl.mul(g, x);

  // Sign
  const msg = 'message';

  // 1.
  const randomR = (BigInt(`0x${randomBytes(128).toString("hex")}`) % BigInt(CONST_R));
  const r = new mcl.Fr();
  r.setStr(randomR.toString(16), 16);

  // 2.
  const h = mcl.hashAndMapToG1(msg + r.getStr());
  const z = mcl.mul(h, x);

  // 3.
  const k = new mcl.Fr();
  k.setByCSPRNG();
  const u = mcl.mul(g, k);
  const v = mcl.mul(h, k);

  // 4.
  const c = mclUtils.hashFr(
    g.getStr(10).slice(2) +
    h.getStr(10).slice(2) +
    A.getStr(10).slice(2) +
    z.getStr(10).slice(2) +
    u.getStr(10).slice(2) +
    v.getStr(10).slice(2)
  );
  const s = mcl.add(k, mcl.mul(c, x));

  const verifyData = await performVerifyRequest({
    'payload': {
      'A': A.getStr(10).slice(2),
      'sigma': {
        'z': z.getStr(10).slice(2), // G1
        'r': r.getStr(10), // Fr
        's': s.getStr(10), // Fr
        'c': c.getStr(10), // Fr
      },
      'msg': msg,
    },
    'protocol_name': 'gjss',
  });

  if (!verifyData.verified) {
    throw 'testVerifiesValidMessage failed'
  }
}

async function main() {
  await testVerifiesValidMessage();
}

main();