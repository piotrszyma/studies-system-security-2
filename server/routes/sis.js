const express = require('express');
const router = express.Router();
const mcl = require('mcl-wasm');
const storage = require('../storage');
const mclUtils = require('../crypto/mcl-utils');

const CONST_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
}

router.post('/init', async (req, res, next) => {
  await mcl.init(mcl.BLS12_381);

  const {
    protocol_name: procotolName,
    payload: { A: serializedA, X: serializedX },
  } = req.body;

  if (procotolName !== 'sis') {
    next(new Error("This endpoint accepts only 'sis' protocol."));
    return;
  }

  const X = mclUtils.tryDeserializeG1(serializedX);

  if (!X) {
    next(new Error("Invalid serialized X."));
    return;
  }

  const A = mclUtils.tryDeserializeG1(serializedA);

  if (!A) {
    next(new Error("Invalid serialized A."));
    return;
  }

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
});

router.post('/verify', async (req, res, next) => {
  await mcl.init(mcl.BLS12_381);

  const {
    protocol_name: procotolName,
    payload: { s: serializedS },
    session_token: sessionToken,
  } = req.body;

  if (procotolName !== 'sis') {
    next(new Error("This endpoint accepts only 'sis' protocol."));
    return;
  }

  const session = await storage.getSessionByToken(sessionToken);

  if (!session) {
    next(new Error("Invalid session_token."));
    return;
  }

  const { serializedX, serializedA, serializedC } = session.params;
  await storage.deleteSession(sessionToken);

  const s = mclUtils.tryDeserializeFr(serializedS);
  if (!s) {
    next(new Error("Invalid serialized s."));
    return;
  }

  const X = mclUtils.deserializeG1(serializedX);
  const A = mclUtils.deserializeG1(serializedA);
  const c = mclUtils.deserializeFr(serializedC);
  const G1 = mclUtils.getGroupGenerator();

  const GS = mcl.mul(G1, s);
  const AC = mcl.mul(A, c);
  const XAC = mcl.add(X, AC);

  const isValid = XAC.serializeToHexStr() === GS.serializeToHexStr();

  if (isValid) {
    res.send({ verified: true });
  } else {
    res.status(403).send({ verified: false });
  }
});

module.exports = router;