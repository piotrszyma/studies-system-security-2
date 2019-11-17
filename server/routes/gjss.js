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
    payload: { sigma: {
      s: serializedS,
      c: serializedC,
      r: serializedR,
      z: serializedZ,
    }, msg, A: serializedA },
  } = req.body;

  if (procotolName !== 'gjss') {
    throw new Error("This endpoint accepts only 'gjss' protocol.");
  }

  const g = mclUtils.getGenG1();
  const A = mclUtils.tryDeserializeG1(serializedA);
  const s = mclUtils.tryDeserializeFr(serializedS);
  const c = mclUtils.tryDeserializeFr(serializedC);
  const r = mclUtils.tryDeserializeFr(serializedR);
  const z = mclUtils.tryDeserializeG1(serializedZ);

  const h_prim = mcl.hashAndMapToG1(msg + r.getStr());
  const u_prim = mcl.add(mcl.mul(g, s), mcl.mul(A, mcl.neg(c)));
  const v_prim = mcl.add(mcl.mul(h_prim, s), mcl.mul(z, mcl.neg(c)));

  const c_prim = mclUtils.hashFr(
    g.getStr(10).slice(2) +
    h_prim.getStr(10).slice(2) +
    A.getStr(10).slice(2) +
    z.getStr(10).slice(2) +
    u_prim.getStr(10).slice(2) +
    v_prim.getStr(10).slice(2)
  );

  const isValid = c.getStr() == c_prim.getStr();

  if (isValid) {
    res.send({ verified: true });
  } else {
    res.status(403).send({ verified: false });
  }
}));

module.exports = router;
