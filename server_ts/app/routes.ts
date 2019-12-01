import express from 'express';
import SchemeResolver from '../scheme/SchemeResolver';
import SchnorrIdentificationScheme from '../scheme/identification/SchnorrIdentificationScheme';
import { asyncMiddleware } from './utils';


const router = express.Router();
const resolver = new SchemeResolver();
resolver.register(new SchnorrIdentificationScheme());

router.post('/protocols/:schemeName/:schemeMethod', asyncMiddleware((request, response) => {
  const { schemeName, schemeMethod, ...requestParams } = request.params;
  resolver.getMethodFor(schemeName, schemeMethod)(requestParams);
  response.send(request.params);
}));

router.post('/protocols', (request, response) => {
  response.send(resolver.getRegistedSchemeNames());
});

export default router;