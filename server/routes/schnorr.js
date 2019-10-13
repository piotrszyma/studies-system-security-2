const express = require('express');
const router = express.Router();
const mcl = require('mcl-wasm');

const CONST_R = '73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001'
const CONST_P = '1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab';

router.post('/init', async (req, res, next) => {
  const {
    protocol_name: procotolName,
    payload: { A, X },
  } = req.body;

  const m = mcl;
  await mcl.init(mcl.BLS12_381);

  const P = mcl.hashAndMapToG2('genP').serializeToHexStr();
  const Q = mcl.hashAndMapToG2('genQ').serializeToHexStr();

  const c = 'string c value';
  // const session = await storage.createSession();
  res.send({
    'session_token': 'token here',
    'payload': {
      'c': c
    }
  });
});

router.post('/verify', (req, res, next) => {
  const { procotol_name, session_token, s } = req.body;
  // TODO: Verify protocol_name, session_token, s not null strings
  // verify protocol_name exists
  // verify session_token exists

  res.send({ name: 'schnorr verify' });
});

module.exports = router;