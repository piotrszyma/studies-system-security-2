const express = require('express');
const router = express.Router();

const SUPPORTED_PROTOCOLS = ["sis", "sss"];

router.post('/', (req, res, next) => {
  res.send({ schemas: SUPPORTED_PROTOCOLS });
});

module.exports = router;