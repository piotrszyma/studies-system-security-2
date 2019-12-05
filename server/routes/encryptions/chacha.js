const express = require('express');
const crypto = require('crypto');
const chacha = require('chacha');
const fs = require('fs');
const { asyncMiddleware } = require('../../utils');
const axios = require('axios');
const router = express.Router();
const CHACHA_KEY = fs.readFileSync('keys/chacha_key.bin');
const config = require('../../config');

const ADDRESS = config.serverConfig.address;
const PORT = config.serverConfig.httpsPort;


router.get('*', asyncMiddleware(async (req, res, next) => {
  // const { ciphertext: ciphertextb64, nonce: nonceb64 } = req.body;

  // const ciphertext = Buffer.from(ciphertextb64, 'base64');
  // const requestNonce = Buffer.from(nonceb64, 'base64');

  // const decipherFactory = crypto.createDecipheriv(
  //   'chacha20-poly1305', CHACHA_KEY, requestNonce);

  // const decrypted = decipherFactory.update(ciphertext);

  // const data = JSON.parse(decrypted.toString());

  const path = req.path;

  let response;
  try {
    response = await axios.get(`https://${ADDRESS}:${PORT}/protocols${path}`);
  } catch (error) {
    throw error.response.data;
  }

  const msg = JSON.stringify(response.data);
  const responseNonce = crypto.randomBytes(12);
  const cipherFactory = chacha.createCipher(CHACHA_KEY, responseNonce);
  const responseCiphertext = cipherFactory.update(msg, 'utf8');
  await cipherFactory.final();
  const tag = cipherFactory.getAuthTag();
  res.send({
    ciphertext: responseCiphertext.toString('base64'),
    nonce: responseNonce.toString('base64'),
    tag: tag.toString('base64'),
  });

  // const msg = JSON.stringify(response.data);
  // const responseNonce = crypto.randomBytes(12);
  // const cipherFactory = crypto.createCipheriv(
  //   'chacha20-poly1305', CHACHA_KEY, responseNonce);
  // const responseCiphertext = cipherFactory.update(msg);

  // res.send({
  //   ciphertext: responseCiphertext.toString('base64'),
  //   nonce: responseNonce.toString('base64'),
  // });
}));


router.post('*', asyncMiddleware(async (req, res, next) => {
  const { ciphertext: ciphertextb64, nonce: nonceb64 } = req.body;
  // TODO: Analyze if tag is needed here (maybe)

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
  const cipherFactory = chacha.createCipher(CHACHA_KEY, responseNonce);
  const responseCiphertext = cipherFactory.update(msg, 'utf8');
  await cipherFactory.final();
  const tag = cipherFactory.getAuthTag();
  res.send({
    ciphertext: responseCiphertext.toString('base64'),
    nonce: responseNonce.toString('base64'),
    tag: tag.toString('base64'),
  });
}));

module.exports = router;