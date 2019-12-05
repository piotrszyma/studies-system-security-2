const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const mcl = require('mcl-wasm');
const storage = require('../storage');
const mclUtils = require('../crypto/mcl-utils');
const { asyncMiddleware } = require('../utils');
const { randomBytes } = require('crypto');
const fs = require('fs');


let skBserialized = fs.readFileSync('cert/naxospriv.pem').toString();
let pubBserialized = fs.readFileSync('cert/naxospub.pem').toString();


router.get('/pkey', asyncMiddleware(async (req, res, next) => {
  res.send({
    'B': pubBserialized
  });
}));

router.post('/exchange', asyncMiddleware(async (req, res, next) => {
  await mcl.init(mcl.BLS12_381);
  const g = mclUtils.getGenG1();

  const skB = new mcl.Fr(); skB.setStr(skBserialized);
  const pubB = new mcl.G1(); pubB.setStr(`1 ${pubBserialized}`);

  let {
    protocol_name: procotolName,
    payload: {
      X: serializedX,
      A: serializedA, // pubA
      msg,
    },
  } = req.body;

  if (procotolName !== 'naxos') {
    throw new Error("This endpoint accepts only 'naxos' protocol.");
  }

  // const eskB = (BigInt(`0x${randomBytes(~~(111 / 8) + 1).toString("hex")}`)).toString(10); // Server returns to client in response
  const eskB = Array.from({ length: 512 }).map(_ => (~~(Math.random() * 10)) % 2).join('')

  const X = mclUtils.tryDeserializeG1(serializedX);
  const pubA = mclUtils.tryDeserializeG1(serializedA);

  // Server generates and sends to client
  const Y = mcl.mul(g, mclUtils.hashFr(eskB + skB.getStr(10)));

  const hasher = crypto.createHash('sha3-512');

  const pkAH = mcl.mul(pubA, mclUtils.hashFr(eskB + skB.getStr(10))).getStr(10).slice(2);
  const Xskb = mcl.mul(X, skB).getStr(10).slice(2);
  const XH = mcl.mul(X, mclUtils.hashFr(eskB + skB.getStr(10))).getStr(10).slice(2);

  const serverKey = hasher.update(
    pkAH +
    Xskb +
    XH +
    serializedA +
    pubBserialized
  ).digest();

  msg = new Uint8Array(Buffer.from(msg));

  const hashWithMsg = new Uint8Array(serverKey.length + msg.length);
  hashWithMsg.set(serverKey);
  hashWithMsg.set(msg, serverKey.length);

  const msgHash = crypto.createHash('sha3-512');
  const hashOfMsg = msgHash.update(hashWithMsg).digest('base64');

  res.send({
    'Y': mclUtils.serializeG1(Y),
    'msg': hashOfMsg,
  });
}));


module.exports = router;