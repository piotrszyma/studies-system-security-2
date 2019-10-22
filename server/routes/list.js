const express = require('express');
const router = express.Router();

const SUPPORTED_PROTOCOLS = ["sis", "sss", "ois"];

router.get('/', (req, res, next) => {
  res.send({ schemas: SUPPORTED_PROTOCOLS });
});

module.exports = router;