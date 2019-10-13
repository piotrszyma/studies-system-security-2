const models = require('./models');

async function createSession(params = {}) {
  return await models.Session.create({
    params: params
  });
}

async function getSessionByToken(sessionToken) {
  return await models.Session.findOne({
    where: {
      token: sessionToken
    }
  });
}

async function deleteSession(sessionToken) {
  return await models.Session.destroy({
    where: {
      token: sessionToken
    }
  })
}

module.exports = {
  createSession,
  getSessionByToken,
  deleteSession,
}