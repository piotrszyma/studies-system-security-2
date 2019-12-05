const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const { asyncMiddleware } = require('../../utils');
const axios = require('axios');
const router = express.Router();
const CHACHA_KEY = fs.readFileSync('keys/chacha_key.bin');
const config = require('../../config');

const ADDRESS = config.serverConfig.address;
const PORT = config.serverConfig.httpsPort;

router.all('*', asyncMiddleware(async (req, res, next) => {
  const { ciphertext: ciphertextb64, nonce: nonceb64 } = req.body;

  const ciphertext = Buffer.from(ciphertextb64, 'base64');
  const requestNonce = Buffer.from(nonceb64, 'base64');

  const decipherFactory = crypto.createDecipheriv(
    'chacha20-poly1305', CHACHA_KEY, requestNonce);

  const decrypted = decipherFactory.update(ciphertext);

  const data = JSON.parse(decrypted.toString());

  const path = req.path;

  let response;
  try {
    response = await axios.post(`https://${ADDRESS}:${PORT}/protocols${path}`, data);
  } catch (error) {
    throw error.response.data;
  }

  const msg = JSON.stringify(response.data);
  const responseNonce = crypto.randomBytes(12);
  const cipherFactory = crypto.createCipheriv(
    'chacha20-poly1305', CHACHA_KEY, responseNonce);
  const responseCiphertext = cipherFactory.update(msg);

  res.send({
    ciphertext: responseCiphertext.toString('base64'),
    nonce: responseNonce.toString('base64'),
  });
}));

module.exports = router;