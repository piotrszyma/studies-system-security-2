const { randomBytes } = require('crypto');
const mcl = require('mcl-wasm');
const config = require('../../config');
const mclUtils = require('../crypto/mcl-utils');
const CONST_G1 = config.points.g1;
const CONST_R = config.consts.r;

async function protocolExecutionExample() {
  await mcl.init(mcl.BLS12_381);

  const randomR = (BigInt(`0x${randomBytes(128).toString("hex")}`) % BigInt(CONST_R));

  // Prover generates random x.
  const x = new mcl.Fr();
  x.setStr(randomR.toString(16), 16);

  // Prover generates public key A.
  const g1 = mclUtils.getGenG1(); // G1
  const A = mcl.mul(g1, x); // G1

  // Prover generates message hash.
  const msg = 'msg';
  const hash = mcl.hashAndMapToG2(msg); // G2
  const sigma = mcl.mul(hash, x); // G2

  const e1 = mcl.pairing(g1, sigma)
  const e2 = mcl.pairing(A, hash)

  if (e1.getStr() == e2.getStr()) {
    console.log("Accepted");
  } else {
    console.log("Rejected");
  }
}


protocolExecutionExample();
