import express from 'express';
import SchemeResolver from '../scheme/SchemeResolver';
import SchnorrIdentificationScheme from '../scheme/identification/SchnorrIdentificationScheme';
import { asyncMiddleware } from './utils';
import * as process from 'process';
import { SchemeName } from '../scheme/Scheme';

const router = express.Router();
const resolver = new SchemeResolver();
resolver.register(new SchnorrIdentificationScheme());

function assertSchemeNameInBodyMatches(requestBody: Object, schemeName: SchemeName) {
  const requestSchemeName = requestBody['protocol_name'];
  if (requestSchemeName !== schemeName) {
    throw new Error(`Scheme name mismatch! ${requestSchemeName} !== ${schemeName}`);
  }
}

router.post('/protocols/:schemeName/:schemeMethod', asyncMiddleware(async (request, response) => {
  const { schemeName, schemeMethod } = request.params;
  console.log(request.body);
  const scheme = resolver.getScheme(schemeName);
  assertSchemeNameInBodyMatches(request.body, scheme.getName());
  const responseBody = await scheme.getMethod(schemeMethod)(request.body);
  console.log(responseBody);
  response.send(responseBody);
}));

router.post('/protocols', (request, response) => {
  response.send(resolver.getRegistedSchemeNames());
});

export default router;