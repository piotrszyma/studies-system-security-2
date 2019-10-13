const express = require('express');
const router = express.Router();

const storage = require('../storage/index.js');
const fs = require("fs");
const { OpenApiValidator } = require("express-openapi-validate");
const jsYaml = require("js-yaml");

const openApiDocument = jsYaml.safeLoad(
  fs.readFileSync("../system_security_2/openapi/api.yaml", "utf-8")
);
const validator = new OpenApiValidator(openApiDocument);


router.post('/init', validator.validate('post', '/protocols/sis/init'), async (req, res, next) => {

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