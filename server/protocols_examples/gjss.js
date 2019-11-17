const { randomBytes } = require('crypto');
const mcl = require('mcl-wasm');
const config = require('../config');
const mclUtils = require('../crypto/mcl-utils');
const CONST_G1 = config.points.g1;

async function protocolExecutionExample() {
  await mcl.init(mcl.BLS12_381);

  // Key Generation
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const g1 = mclUtils.getGenG1(); // G1
  const X = mcl.mul(g1, x); // G1

  // Sign

  const msg = 'test';

  const k = new mcl.Fr();
  k.setByCSPRNG();

  const u = mcl.mul(g1, k);

  const h = mcl.hashAndMapToG1(u.getStr(10));

  const z = mcl.mul(h, x);

  const v = mcl.mul(h, k);

  const c = mclUtils.hash(
    msg +
    g1.getStr(10).slice(2) +
    h.getStr(10).slice(2) +
    X.getStr(10).slice(2) +
    z.getStr(10).slice(2) +
    u.getStr(10).slice(2) +
    v.getStr(10).slice(2));

  // How to perform add?
  // const s = mcl.add(k, c + x)

  const signature = [z, s, c];

  const u_prim = mcl.add(mcl.mul(g1, s), mcl.mul(X, mcl.add(-1, c)));
  const h_prim = mcl.hashAndMapToG1(u_prim);

  const v_prim = mcl.add(mcl.mul(h_prim, s), mcl.mul(z, mcl.add(-1, c)));

  const c_prim = mclUtils.hash(
    msg +
    g1.getStr(10).slice(2) +
    h_prim.getStr(10).slice(2) +
    X.getStr(10).slice(2) +
    z.getStr(10).slice(2) +
    u_prim.getStr(10).slice(2) +
    v_prim.getStr(10).slice(2));

  if (c.getStr() == c_prim.getStr()) {
    console.log("Accepted");
  } else {
    console.log("Rejected");
  }
}


protocolExecutionExample();
