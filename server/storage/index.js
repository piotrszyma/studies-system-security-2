const uuid = require('uuid/v4');
const models = require('./models');

async function createSession(params = {}) {
  return await models.Session.create({
    params: params
  });
}

module.exports = {
  createSession,
}