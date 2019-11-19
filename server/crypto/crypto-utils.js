const crypto = require('crypto');
const fs = require('fs');

function mac(value, key) {
  const cipher = crypto.createCipher('chacha20-poly1305', key);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};