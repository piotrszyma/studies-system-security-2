import express from 'express';
import SchemeResolver from '../scheme/SchemeResolver';
import SchnorrIdentificationScheme from '../scheme/identification/SchnorrIdentificationScheme';
import OkamotoIdentificationScheme from '../scheme/identification/OkamotoIdentificationScheme';
import { asyncMiddleware } from './utils';
import { SchemeName } from '../scheme/Scheme';
import ModSchnorrIdentificationScheme from '../scheme/identification/ModSchnorrIdentificationScheme';
import SchnorrSignatureScheme from '../scheme/signature/SchnorrSignatureScheme';
import BLSSignatureScheme from '../scheme/signature/BLSSignatureScheme';

const router = express.Router();
const resolver = new SchemeResolver();
// Identification schemes.
resolver.register(new SchnorrIdentificationScheme());
resolver.register(new OkamotoIdentificationScheme());
resolver.register(new ModSchnorrIdentificationScheme());

// Signature schemes.
resolver.register(new SchnorrSignatureScheme());
resolver.register(new BLSSignatureScheme());

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