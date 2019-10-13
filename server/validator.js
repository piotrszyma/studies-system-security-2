const fs = require("fs");
const { OpenApiValidator } = require("express-openapi-validate");
const jsYaml = require("js-yaml");

const openApiDocument = jsYaml.safeLoad(
  fs.readFileSync("../system_security_2/openapi/api.yaml", "utf-8")
);
const validator = new OpenApiValidator(openApiDocument);

module.exports = validator;