const express = require('express');
const router = express.Router();
const mcl = require('mcl-wasm');
const mclUtils = require('../crypto/mcl-utils');
const { asyncMiddleware } = require('../utils');


router.post('/verify', asyncMiddleware(async (req, res, next) => {
  await mcl.init(mcl.BLS12_381);
  const {
    protocol_name: procotolName,
    payload: { A: serializedA, X: serializedX, s: serializedS, msg },
  } = req.body;

  if (procotolName !== 'sss') {
    next(new Error("This endpoint accepts only 'sss' protocol."));
    return;
  }

  const X = mclUtils.tryDeserializeG1(serializedX);
  const A = mclUtils.tryDeserializeG1(serializedA);
  const s = mclUtils.tryDeserializeFr(serializedS);

  const hash = mclUtils.hash(msg + serializedX);

  const c = new mcl.Fr();
  // TODO: Analyze setStr / setInt
  c.setStr(hash);

  const gen1 = mclUtils.getGenG1();
  const GS = mcl.mul(gen1, s);
  const AC = mcl.mul(A, c);
  const XAC = mcl.add(X, AC);

  const isValid = XAC.serializeToHexStr() === GS.serializeToHexStr();

  if (isValid) {
    res.send({ valid: true });
  } else {
    res.status(403).send({ valid: false });
  }
}));

module.exports = router;
