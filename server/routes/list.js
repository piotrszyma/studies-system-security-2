const express = require('express');
const router = express.Router();

const SUPPORTED_PROTOCOLS = ["gjss", "blsss", "sis", "sss", "ois", "msis"];

router.get('/', (req, res, next) => {
  res.send({ schemas: SUPPORTED_PROTOCOLS });
});

module.exports = router;