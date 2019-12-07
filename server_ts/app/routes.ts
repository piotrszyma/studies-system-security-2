import express from 'express';
import { asyncMiddleware } from './utils';
import { handleRequest, handleProtocolsRequest, handleEncryptedRequest, handleEncryptedProtocolsRequest } from './handlers';

const router = express.Router();

router.post('/protocols/:schemeName/:schemeMethod', asyncMiddleware(async (request, response) => {
  const { schemeName, schemeMethod } = request.params;
  const responseBody = await handleRequest(schemeName, schemeMethod, request.body);
  response.send(responseBody);
}));


router.get('/protocols/:schemeName/:schemeMethod', asyncMiddleware(async (request, response) => {
  const { schemeName, schemeMethod } = request.params;
  const responseBody = await handleRequest(schemeName, schemeMethod);
  response.send(responseBody);
}));

router.get('/protocols', (request, response) => {
  response.send(handleProtocolsRequest());
});

router.get('/:encryptionName/protocols', (request, response) => {
  const { encryptionName } = request.params;
  response.send(handleEncryptedProtocolsRequest(encryptionName));
});


router.all('/:encryptionName/protocols/:schemeName/:schemeMethod', asyncMiddleware(async (request, response) => {
  const { encryptionName, schemeName, schemeMethod } = request.params;
  const responseBody = await handleEncryptedRequest(encryptionName, schemeName, schemeMethod, request.body);
  response.send(responseBody);
}));


export default router;