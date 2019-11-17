const express = require('express');
const router = express.Router();
const mcl = require('mcl-wasm');
const storage = require('../storage');
const mclUtils = require('../crypto/mcl-utils');
const { asyncMiddleware } = require('../utils');

router.post('/pkey', asyncMiddleware(async (req, res, next) => {


}));

router.post('/exchange', asyncMiddleware(async (req, res, next) => {
}));

module.exports = router;