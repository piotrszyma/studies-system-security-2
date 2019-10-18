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

  if (procotolName !== 'ois') {
    throw new Error("This endpoint accepts only 'ois' protocol.");
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
    payload: { s1: serializedS1, s2: serializedS2 },
    session_token: sessionToken,
  } = req.body;

  if (procotolName !== 'ois') {
    throw new Error("This endpoint accepts only 'ois' protocol.");
  }

  const session = await storage.getSessionByToken(sessionToken);

  if (!session) {
    throw new Error("Invalid session_token.");
  }

  const { serializedX, serializedA, serializedC } = session.params;
  await storage.deleteSession(sessionToken);

  const s1 = mclUtils.tryDeserializeFr(serializedS1);
  const s2 = mclUtils.tryDeserializeFr(serializedS2);
  const g1 = mclUtils.getGenG1();
  const g2 = mclUtils.getGenG2();

  const X = mclUtils.deserializeG1(serializedX);
  const A = mclUtils.deserializeG1(serializedA);
  const c = mclUtils.deserializeFr(serializedC);

  const g1s1g2s2 = mcl.add(mcl.mul(g1, s1), mcl.mul(g2, s2));
  const AC = mcl.mul(A, c);
  const XAC = mcl.add(X, AC);

  const isValid = XAC.serializeToHexStr() === g1s1g2s2.serializeToHexStr();

  if (isValid) {
    res.send({ verified: true });
  } else {
    res.status(403).send({ verified: false });
  }
}));

module.exports = router;
