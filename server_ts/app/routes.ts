import express from 'express';
const router = express.Router();

router.post('/protocols/:scheme/:method', (request, response) => {
  const { scheme, method } = request.params;
  response.send(request.params);
});

router.post('/', (request, response) => {
  response.send(request.params);
});

export default router;