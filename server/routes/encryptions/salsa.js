const express = require('express');
const _sodium = require('libsodium-wrappers');
const fs = require('fs');
const { asyncMiddleware } = require('../../utils');
const axios = require('axios');
const router = express.Router();
const SODIUM_KEY = fs.readFileSync('keys/salsa_key.bin');
const config = require('../../config');

const ADDRESS = config.serverConfig.address;
const PORT = config.serverConfig.httpsPort;

router.all('*', asyncMiddleware(async (req, res, next) => {
  await _sodium.ready;
  const sodium = _sodium;
  const { ciphertext: ciphertextb64, nonce: nonceb64 } = req.body;

  const ciphertext = new Uint8Array(Buffer.from(ciphertextb64, 'base64'));
  const requestNonce = new Uint8Array(Buffer.from(nonceb64, 'base64'));
  const decrypted = sodium.crypto_secretbox_open_easy(ciphertext, requestNonce, SODIUM_KEY);
  const data = JSON.parse(Buffer.from(decrypted).toString());
  const path = req.path;

  let response;
  try {
    response = await axios.post(`https://${ADDRESS}:${PORT}/protocols${path}`, data);
  } catch (error) {
    throw error.response.data;
  }

  const msg = JSON.stringify(response.data);
  const responseNonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const responseCiphertext = sodium.crypto_secretbox_easy(
    msg, responseNonce, SODIUM_KEY, "base64");

  // const 
  res.send({
    ciphertext: responseCiphertext,
    nonce: Buffer.from(responseNonce).toString('base64'),
  });
}));

module.exports = router;