const { randomBytes } = require('crypto');
const mcl = require('mcl-wasm');
const config = require('../config');

const mclUtils = require('../crypto/mcl-utils');
const CONST_G1 = config.points.g1;
const CONST_R = config.consts.r;

async function protocolExecutionExample() {
  await mcl.init(mcl.BLS12_381);
  const securityParam = 111;
  const g1 = mclUtils.getGenG1();

  const skA = new mcl.Fr(); skA.setByCSPRNG();
  const skB = new mcl.Fr(); skB.setByCSPRNG();

  const pubA = mcl.mul(g1, skA);
  const pubB = mcl.mul(g1, skB);

  const eskA = (BigInt(`0x${randomBytes(~~(111 / 8) + 1).toString("hex")}`)).toString(10);
  const eskB = (BigInt(`0x${randomBytes(~~(111 / 8) + 1).toString("hex")}`)).toString(10);

  const X = mcl.mul(g1, mclUtils.hashFr(eskA + skA.getStr(10)));
  const Y = mcl.mul(g1, mclUtils.hashFr(eskB + skB.getStr(10)));

  const clientKey = mclUtils.hash(
    mcl.mul(pubA, mclUtils.hashFr(eskB + skB.getStr(10))).getStr(10).slice(2) +
    mcl.mul(X, skB).getStr(10).slice(2) +
    mcl.mul(X, mclUtils.hashFr(eskB + skB.getStr(10))).getStr(10).slice(2)
  );

  const serverKey = mclUtils.hash(
    mcl.mul(Y, skA).getStr(10).slice(2) +
    mcl.mul(pubB, mclUtils.hashFr(eskA + skA.getStr(10))).getStr(10).slice(2) +
    mcl.mul(Y, mclUtils.hashFr(eskA + skA.getStr(10))).getStr(10).slice(2)
  );

  if (serverKey === clientKey) {
    console.log("Accepted");
  } else {
    console.log("Rejected");
  }
}


protocolExecutionExample();
