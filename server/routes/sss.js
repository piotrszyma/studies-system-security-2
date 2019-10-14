const express = require('express');
const router = express.Router();
const mcl = require('mcl-wasm');
const storage = require('../storage');
const crypto = require('crypto');

const CONST_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
}

const CONST_R = '0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001';

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
    res.status(403).send({ message: "This endpoint accepts only 'sss' protocol." });
    return;
  }

  const X = new mcl.G1();
  try {
    X.setStr(`1 ${serializedX}`);
  } catch (error) {
    res.status(400).send({ message: "Invalid serialized X." });
    return;
  }

  const A = new mcl.G1();
  try {
    A.setStr(`1 ${serializedA}`);
  } catch (error) {
    res.status(400).send({ message: "Invalid serialized A." });
    return;
  }

  const s = new mcl.Fr();
  try {
    s.setStr(serializedS);
  } catch (error) {
    res.status(400).send({ message: "Invalid serialized s." });
    return;
  }

  const msgHash = getHash(msg + X.getStr(16));
  const hashInt = BigInt('0x' + msgHash);
  c = new mcl.Fr();

  const r = BigInt(CONST_R);

  c.setStr((hashInt % r).toString());

  const G1 = new mcl.G1();
  G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);

  const GS = mcl.mul(G1, s);
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
