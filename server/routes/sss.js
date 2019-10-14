const express = require('express');
const router = express.Router();
const mcl = require('mcl-wasm');
const crypto = require('crypto');
const mclUtils = require('../crypto/mcl-utils');


function getHash(value) {
  const hasher = crypto.createHash('sha3-256');
  hasher.update(value);
  return hasher.digest('hex');
}


router.post('/verify', async (req, res, next) => {
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
  if (!X) {
    res.status(400).send({ message: "Invalid serialized X." });
    return;
  }

  const A = mclUtils.tryDeserializeG1(serializedA);
  if (!A) {
    res.status(400).send({ message: "Invalid serialized A." });
    return;
  }

  const s = mclUtils.tryDeserializeFr(serializedS);
  if (!s) {
    res.status(400).send({ message: "Invalid serialized s." });
    return;
  }

  const c = mclUtils.hashFr(msg + X.getStr(16));
  const gen1 = mclUtils.getGroupGenerator();
  const GS = mcl.mul(gen1, s);
  const AC = mcl.mul(A, c);
  const XAC = mcl.add(X, AC);

  const isValid = XAC.serializeToHexStr() === GS.serializeToHexStr();

  if (isValid) {
    res.send({ valid: true });
  } else {
    res.status(403).send({ valid: false });
  }
})

module.exports = router;
