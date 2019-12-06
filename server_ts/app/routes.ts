import express, { response } from 'express';
import SchemeResolver from '../scheme/SchemeResolver';
import SchnorrIdentificationScheme from '../scheme/identification/SchnorrIdentificationScheme';
import OkamotoIdentificationScheme from '../scheme/identification/OkamotoIdentificationScheme';
import { asyncMiddleware } from './utils';
import { SchemeName, SchemeMethodName } from '../scheme/Scheme';
import ModSchnorrIdentificationScheme from '../scheme/identification/ModSchnorrIdentificationScheme';
import SchnorrSignatureScheme from '../scheme/signature/SchnorrSignatureScheme';
import BLSSignatureScheme from '../scheme/signature/BLSSignatureScheme';
import GochJareckiSignatureScheme from '../scheme/signature/GochJareckiSignatureScheme';
import NaxosKeyExchangeScheme from '../scheme/exchange/NaxosKeyExchangeScheme';
import EncryptionResolver from '../encryptions/EncryptionResolver';
import ChachaEncryption from '../encryptions/ChachaEncryption';
import SalsaEncryption from '../encryptions/SalsaEncryption';
import { EncryptionName } from '../encryptions/Encryption';

const router = express.Router();
const schemeResolver = new SchemeResolver();
// Identification schemes.
schemeResolver.register(new SchnorrIdentificationScheme());
schemeResolver.register(new OkamotoIdentificationScheme());
schemeResolver.register(new ModSchnorrIdentificationScheme());

// Signature schemes.
schemeResolver.register(new SchnorrSignatureScheme());
schemeResolver.register(new BLSSignatureScheme());
schemeResolver.register(new GochJareckiSignatureScheme());

// Key exchange.
schemeResolver.register(new NaxosKeyExchangeScheme());

const encryptionResolver = new EncryptionResolver();
encryptionResolver.register(new ChachaEncryption());
encryptionResolver.register(new SalsaEncryption());


function assertSchemeNameInBodyMatches(requestBody: Object, schemeName: SchemeName) {
  const requestSchemeName = requestBody['protocol_name'];
  if (requestSchemeName !== schemeName) {
    throw new Error(`Scheme name mismatch! ${requestSchemeName} !== ${schemeName}`);
  }
}

async function handleRequest(schemeName: SchemeName, schemeMethod: SchemeMethodName, requestBody = undefined): Promise<Object> {
  const scheme = schemeResolver.getScheme(schemeName);
  if (requestBody) {
    console.log(requestBody);
    assertSchemeNameInBodyMatches(requestBody, scheme.getName());
  }
  const responseBody = await scheme.getMethod(schemeMethod)(requestBody);
  console.log(responseBody);
  return responseBody
}

async function handleEncryptedRequest(encryptionName: EncryptionName, schemeName: SchemeName, schemeMethod: SchemeMethodName, requestBody = undefined): Promise<Object> {
  const encryption = encryptionResolver.getEncryption(encryptionName);
  const decryptedRequestBody = requestBody ? await encryption.decrypt(requestBody) : undefined;
  const responseBody = await handleRequest(schemeName, schemeMethod, decryptedRequestBody);
  const encryptedResponseBody = await encryption.encrypt(responseBody);
  return encryptedResponseBody;
}

router.post('/protocols/:schemeName/:schemeMethod', asyncMiddleware(async (request, response) => {
  const { schemeName, schemeMethod } = request.params;
  console.log(request.body);
  const responseBody = await handleRequest(schemeName, schemeMethod, request.body);
  console.log(responseBody);
  response.send(responseBody);
}));


router.get('/protocols/:schemeName/:schemeMethod', asyncMiddleware(async (request, response) => {
  const { schemeName, schemeMethod } = request.params;
  console.log(request.body);
  const responseBody = await handleRequest(schemeName, schemeMethod);
  console.log(responseBody);
  response.send(responseBody);
}));

router.post('/protocols', (request, response) => {
  response.send(schemeResolver.getRegistedSchemeNames());
});

router.all('/:encryptionName/protocols/:schemeName/:schemeMethod', asyncMiddleware(async (request, response) => {
  const { encryptionName, schemeName, schemeMethod } = request.params;
  const responseBody = await handleEncryptedRequest(encryptionName, schemeName, schemeMethod, request.body);
  response.send(responseBody);
}));


export default router;