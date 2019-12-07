const mcl = require('mcl-wasm');
const { randomBytes } = require('crypto');
const axios = require('axios');
const mclUtils = require('../crypto/mcl-utils.js');
const config = require('../config');

const PORT = config.testedPort;
const ADDRESS = config.testedAddress;

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
  // TODO(szyma): Use binary format...
  // const randomR = (BigInt(`0x${randomBytes(128).toString("hex")}`) % BigInt(CONST_R));
  const r = Array.from({ length: 128 }).map(_ => (~~(Math.random() * 10)) % 2).join('');
  // r.setStr(randomR.toString(16), 16);

  // 2.
  const h = mcl.hashAndMapToG1(msg + r);
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
        'r': r, // bitstring
        's': s.getStr(10), // Fr
        'c': c.getStr(10), // Fr
      },
      'msg': msg,
    },
    'protocol_name': 'gjss',
  });

  if (!verifyData.valid) {
    throw 'testVerifiesValidMessage failed'
  }
}

async function main() {
  await testVerifiesValidMessage();
}

main();