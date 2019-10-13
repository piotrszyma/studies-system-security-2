const express = require('express');
const router = express.Router();

const fs = require("fs");
const { OpenApiValidator } = require("express-openapi-validate");
const jsYaml = require("js-yaml");

const openApiDocument = jsYaml.safeLoad(
  fs.readFileSync("api.yaml", "utf-8")
);
const validator = new OpenApiValidator(openApiDocument);

const SUPPORTED_PROTOCOLS = ["sis"];
/* GET home page. */
router.post('/echo', validator.validate('post', '/echo'), (req, res, next) => {
  res.send({ schemas: SUPPORTED_PROTOCOLS });
});

module.exports = router;