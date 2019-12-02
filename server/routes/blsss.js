const express = require('express');
const router = express.Router();
const mcl = require('mcl-wasm');
const storage = require('../storage');
const mclUtils = require('../crypto/mcl-utils');
const { asyncMiddleware } = require('../utils');

router.post('/verify', asyncMiddleware(async (req, res, next) => {
  await mcl.init(mcl.BLS12_381);

  const {
    protocol_name: procotolName,
    payload: { sigma: serializedSigma, A: serializedA, msg },
  } = req.body;

  if (procotolName !== 'blsss') {
    throw new Error("This endpoint accepts only 'blsss' protocol.");
  }

  const hash = mcl.hashAndMapToG2(msg);
  const sigma = mclUtils.tryDeserializeG2(serializedSigma);

  const A = mclUtils.tryDeserializeG1(serializedA);
  const g1 = mclUtils.getGenG1();

  const e1 = mcl.pairing(g1, sigma);
  const e2 = mcl.pairing(A, hash);

  const isValid = e1.getStr() === e2.getStr();

  if (isValid) {
    res.send({ valid: true });
  } else {
    res.status(403).send({ valid: false });
  }
}));

module.exports = router;
