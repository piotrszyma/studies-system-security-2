import { Session } from './models';

type Token = string;

export async function createSession(params: Object = {}): Promise<Token> {
  const session = await Session.create({
    params: params
  });
  return session.token;
}

export async function getSessionByToken(sessionToken): Promise<Object> {
  const session = await Session.findOne({
    where: {
      token: sessionToken
    }
  });

  if (!session) {
    throw new Error("Invalid session_token.");
  }

  return session.params;
}

export async function deleteSession(sessionToken): Promise<Session> {
  return await Session.destroy({
    where: {
      token: sessionToken
    }
  })
}
