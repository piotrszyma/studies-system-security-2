const express = require('express');
const router = express.Router();
const mcl = require('mcl-wasm');
const storage = require('../storage');
const mclUtils = require('../crypto/mcl-utils');
const { asyncMiddleware } = require('../utils');


let skB = null;
let pubB = null;


router.post('/pkey', asyncMiddleware(async (req, res, next) => {
  await mcl.init(mcl.BLS12_381);
  const g = mclUtils.getGenG1();

  if (!skB) {
    skB = new mcl.Fr(); skB.setByCSPRNG();
    pubB = mcl.mul(g, privKey);
  }

  res.send({
    'payload': {
      'B': mclUtils.serializeG1(pubB)
    }
  });
}));

router.post('/exchange', asyncMiddleware(async (req, res, next) => {
  await mcl.init(mcl.BLS12_381);
  const g = mclUtils.getGenG1();


  const {
    protocol_name: procotolName,
    payload: {
      X: serializedX,
      A: serializedA, // pubA
      msg,
    },
  } = req.body;

  const eskB = (BigInt(`0x${randomBytes(~~(111 / 8) + 1).toString("hex")}`)).toString(10); // Server returns to client in response

  const X = mclUtils.deserializeG1(serializedX);
  const pubA = mclUtils.deserializeG1(serializedA);

  // Server generates and sends to client
  const Y = mcl.mul(g, mclUtils.hashFr(eskB + skB.getStr(10)));

  const serverKey = mclUtils.hash(
    mcl.mul(pubA, mclUtils.hashFr(eskB + skB.getStr(10))).getStr(10).slice(2) +
    mcl.mul(X, skB).getStr(10).slice(2) +
    mcl.mul(X, mclUtils.hashFr(eskB + skB.getStr(10))).getStr(10).slice(2)
  );

  const verificationHash = Buffer.from(mclUtils.hash(serverKey + msg)).toString('base64');

  res.send({
    'payload': {
      'Y': mclUtils.serializeG1(Y),
      'msg': verificationHash,
    }
  });



}));

module.exports = router;