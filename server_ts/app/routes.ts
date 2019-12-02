import express from 'express';
import SchemeResolver from '../scheme/SchemeResolver';
import SchnorrIdentificationScheme from '../scheme/identification/SchnorrIdentificationScheme';
import { asyncMiddleware } from './utils';
import * as process from 'process';

const router = express.Router();
const resolver = new SchemeResolver();
resolver.register(new SchnorrIdentificationScheme());

router.post('/protocols/:schemeName/:schemeMethod', asyncMiddleware(async (request, response) => {
  const { schemeName, schemeMethod } = request.params;
  console.log(request.body);
  const schemeResult = await resolver.getMethodFor(schemeName, schemeMethod)(request.body);
  response.send(schemeResult);
}));

router.post('/protocols', (request, response) => {
  response.send(resolver.getRegistedSchemeNames());
});

export default router;