const express = require('express');
const { asyncMiddleware } = require('../../utils');
const router = express.Router();

router.post('*', asyncMiddleware(async (req, res, next) => {
  const { appRouter } = require('../../app');
  const response = await appRouter.handle(req, res, (callee) => {

  });

  debugger;
  debugger;
  debugger;
  debugger;
}));

module.exports = router;