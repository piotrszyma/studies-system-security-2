const express = require('express');
const router = express.Router();

router.post('/init', async (req, res, next) => {

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