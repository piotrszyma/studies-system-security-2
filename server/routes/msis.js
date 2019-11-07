const express = require('express');
const router = express.Router();
const mcl = require('mcl-wasm');
const storage = require('../storage');
const mclUtils = require('../crypto/mcl-utils');
const { asyncMiddleware } = require('../utils');

router.post('/init', asyncMiddleware(async (req, res, next) => {
  await mcl.init(mcl.BLS12_381);

  const {
    protocol_name: procotolName,
    payload: { A: serializedA, X: serializedX },
  } = req.body;

  if (procotolName !== 'msis') {
    throw new Error("This endpoint accepts only 'msis' protocol.");
  }

  mclUtils.tryDeserializeG1(serializedX);
  mclUtils.tryDeserializeG1(serializedA);
  const c = new mcl.Fr();
  c.setByCSPRNG();

  const serializedC = mclUtils.serializeFr(c);

  const session = await storage.createSession({
    serializedA: serializedA,
    serializedX: serializedX,
    serializedC: serializedC,
  });

  res.send({
    'session_token': session.token,
    'payload': {
      'c': serializedC
    }
  });
}));

router.post('/verify', asyncMiddleware(async (req, res, next) => {
  await mcl.init(mcl.BLS12_381);

  const {
    protocol_name: procotolName,
    payload: { S: serializedS },
    session_token: sessionToken,
  } = req.body;

  if (procotolName !== 'msis') {
    throw new Error("This endpoint accepts only 'msis' protocol.");
  }

  const session = await storage.getSessionByToken(sessionToken);

  if (!session) {
    throw new Error("Invalid session_token.");
  }

  const { serializedX, serializedA, serializedC } = session.params;
  await storage.deleteSession(sessionToken);

  const X = mclUtils.deserializeG1(serializedX);
  const A = mclUtils.deserializeG1(serializedA);
  const c = mclUtils.deserializeFr(serializedC);
  const g1 = mclUtils.getGenG1();

  const S = mclUtils.tryDeserializeG2(serializedS);
  const gHat = mcl.hashAndMapToG2(X.getStr(10).slice(2) + c.getStr(10));


  const AC = mcl.mul(A, c)
  const XAC = mcl.add(X, AC)

  const e1 = mcl.pairing(g1, S)
  const e2 = mcl.pairing(XAC, gHat)

  const isValid = e1.getStr() === e2.getStr();

  if (isValid) {
    res.send({ verified: true });
  } else {
    res.status(403).send({ verified: false });
  }
}));

module.exports = router;