const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const mcl = require('mcl-wasm');
const fs = require('fs');
const config = require('../config');
const storage = require('../storage');
const mclUtils = require('../crypto/mcl-utils');
const { asyncMiddleware } = require('../utils');


let skBserialized = fs.readFileSync('cert/naxospriv.pem').toString();
let pubBserialized = fs.readFileSync('cert/naxospub.pem').toString();


router.post('/init', asyncMiddleware(async (req, res, next) => {
  await mcl.init(mcl.BLS12_381);

  const {
    protocol_name: protocolName,
    payload: { X: serializedX },
  } = req.body;


  if (protocolName !== 'sigma') {
    throw new Error("This endpoint accepts only 'sigma' protocol.");
  }

  // client pubkey
  const X = mclUtils.tryDeserializeG1(serializedX);

  const y = mclUtils.getRandomFr();
  const g = mclUtils.getGenG1();
  const Y = mcl.mul(g, y);

  const sharedKey = mcl.mul(X, y);

  const secretHash = mclUtils.hashHex(mclUtils.serializeG1(sharedKey));
  const macKey = secretHash.slice(secretHash.length / 2);
  const sessionKey = secretHash.slice(secretHash.length / 2, secretHash.length);

  const macpubB = mclUtils.mac(
    pubBserialized,
    macKey
  );

  const privB = mclUtils.tryDeserializeFr(skBserialized);

  const randomFrSign = mclUtils.getRandomFr();
  const randomG1Sign = mcl.mul(g, randomFrSign);
  const msgToSign = pubBserialized;
  const valueToHash = msgToSign + mclUtils.serializeG1(randomG1Sign);
  const hasher = crypto.createHash('sha3-512');
  hasher.update(valueToHash);
  const msgHash = hasher.digest('hex');
  const r = BigInt(config.consts.r);
  const hashInt = BigInt('0x' + msgHash);
  const intValue = (hashInt % r).toString();
  const c = new mcl.Fr();
  c.setStr(intValue);

  const ac = mcl.mul(randomFrSign, c);
  const s = mcl.add(ac, privB);

  const payload = {
    Y: Y.getStr(10).slice(2),
    B: pubBserialized,
    b_mac: macpubB,
    sig: {
      A: randomG1Sign.getStr(10).slice(2),
      s: s.getStr(10).slice(2),
      msg: msgToSign,
    }
  };

  res.send(payload);
}));

router.post('/exchange', asyncMiddleware(async (req, res, next) => {
  await mcl.init(mcl.BLS12_381);

}));

module.exports = router;