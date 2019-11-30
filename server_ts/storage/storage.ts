import { Session } from './models';

export async function createSession(params: Object = {}): Promise<Session> {
  return await Session.create({
    params: params
  });
}

export async function getSessionByToken(sessionToken): Promise<Session> {
  return await Session.findOne({
    where: {
      token: sessionToken
    }
  });
}

interface withSessionParams {
  sessionToken: string,
}

export async function applyAndDeleteSession(params: withSessionParams): Promise<Object> {
  const { sessionToken } = params;
  const session = await getSessionByToken(sessionToken);

  if (!session) {
    throw new Error("Invalid session_token.");
  }

  await deleteSession(sessionToken);

  return { ...params, ...session.params, sessionToken: undefined };
}

export async function deleteSession(sessionToken): Promise<Session> {
  return await Session.destroy({
    where: {
      token: sessionToken
    }
  })
}
