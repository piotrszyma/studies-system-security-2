const express = require('express');
const router = express.Router();
const mcl = require('mcl-wasm');
const storage = require('../storage');

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

  const c = new mcl.Fr();
  c.setByCSPRNG();
  const serializedC = c.serializeToHexStr();

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
    res.setStatus(403).send("This endpoint accepts only 'sis' protocol.")
  }

  const session = await storage.getSessionByToken(sessionToken);

  const { serializedX, serializedA, serializedC } = session.params;

  const s = mcl.deserializeHexStrToFr(serializedS);
  const X = mcl.deserializeHexStrToG1(serializedX);
  const A = mcl.deserializeHexStrToG1(serializedA);
  const c = mcl.deserializeHexStrToFr(serializedC);

  const G1 = new mcl.G1();
  G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const GS = mcl.mul(G1, s);
  const AC = mcl.mul(A, c);
  const XAC = mcl.add(X, AC);

  res.send({ verified: XAC.serializeToHexStr() === GS.serializeToHexStr() });
});

module.exports = router;