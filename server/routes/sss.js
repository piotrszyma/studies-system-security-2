const express = require('express');
const router = express.Router();
const mcl = require('mcl-wasm');
const storage = require('../storage');
const crypto = require('crypto');

const CONST_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
}

function getHash(value) {
  const hasher = crypto.createHash('sha3-256');
  hasher.update(value);
  return hasher.getHash();
}


router.post('/verify', async (req, res, next) => {
  await mcl.init(mcl.BLS12_381);
  const {
    protocol_name: procotolName,
    payload: { A: serializedA, X: serializedX, c: serializedC, s: serializedS, msg },
  } = req.body;

  const hash = getHash(msg);

  const H = new mcl.Fp();

  const X = new mcl.G1();
  try {
    X.deserializeHexStr(serializedX);
  } catch (error) {
    res.status(400).send({ message: "Invalid serialized X." });
    return;
  }

  const A = new mcl.G1();
  try {
    A.deserializeHexStr(serializedA);
  } catch (error) {
    res.status(400).send({ message: "Invalid serialized A." });
    return;
  }

  const s = new mcl.Fr();
  try {
    s.deserializeHexStr(serializedS);
  } catch (error) {
    res.status(400).send({ message: "Invalid serialized s." });
    return;
  }

  const c = mcl.hashAndMapToG1()



})
