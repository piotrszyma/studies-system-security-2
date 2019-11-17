const { randomBytes } = require('crypto');
const mcl = require('mcl-wasm');
const config = require('../config');
const mclUtils = require('../crypto/mcl-utils');
const CONST_G1 = config.points.g1;
const CONST_R = config.consts.r;

async function protocolExecutionExample() {
  await mcl.init(mcl.BLS12_381);

  // Key Generation
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const g = mclUtils.getGenG1(); // G1
  const y = mcl.mul(g, x);

  // Sign

  const msg = 'test';

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
    y.getStr(10).slice(2) +
    z.getStr(10).slice(2) +
    u.getStr(10).slice(2) +
    v.getStr(10).slice(2)
  );

  const s = mcl.add(k, mcl.mul(c, x));
  const signature = [z, r, s, c];

  const h_prim = mcl.hashAndMapToG1(msg + r.getStr());

  const u_prim = mcl.add(mcl.mul(g, s), mcl.mul(y, mcl.neg(c)));

  const v_prim = mcl.add(mcl.mul(h_prim, s), mcl.mul(z, mcl.neg(c)));

  const c_prim = mclUtils.hashFr(
    g.getStr(10).slice(2) +
    h_prim.getStr(10).slice(2) +
    y.getStr(10).slice(2) +
    z.getStr(10).slice(2) +
    u_prim.getStr(10).slice(2) +
    v_prim.getStr(10).slice(2)
  );

  if (c.getStr() == c_prim.getStr()) {
    console.log("Accepted");
  } else {
    console.log("Rejected");
  }
}


protocolExecutionExample();
