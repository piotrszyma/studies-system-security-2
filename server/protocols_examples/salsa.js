const { randomBytes } = require('crypto');
const mcl = require('mcl-wasm');
const config = require('../config');

const mclUtils = require('../crypto/mcl-utils');
const CONST_G1 = config.points.g1;
const CONST_R = config.consts.r;

async function protocolExecutionExample() {
  // A - client
  // B - server
  await mcl.init(mcl.BLS12_381);
  const g = mclUtils.getGenG1();

  const x = new mcl.Fr(); x.setByCSPRNG(); // Client has his secret
  const gx = mcl.mul(g, x); // Client calculates and sends to server

  const y = new mcl.Fr(); y.setByCSPRNG(); // Server has his secret (generated at server startup)
  const gy = mcl.mul(g, y); // Server calculates from secret key at startup, exposes endpoint

  const gxy = mcl.mul(gx, y);
  const hash = mclUtils.hashHex(gxy.getStr(10).slice(2));

  const macKey = hash.slice(hash.length / 2);
  const sessionKey = hash.slice(hash.length / 2, hash.length);

  console.log(macKey.length);
  console.log(sessionKey.length);

}


protocolExecutionExample();
