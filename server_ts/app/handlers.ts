import { SchemeName, SchemeMethodName } from '../scheme/Scheme';
import { EncryptionName } from '../encryptions/Encryption';
import { encryptionResolver, schemeResolver } from './resolvers';

function assertSchemeNameInBodyMatches(requestBody: Object, schemeName: SchemeName) {
  const requestSchemeName = requestBody['protocol_name'];
  if (requestSchemeName !== schemeName) {
    throw new Error(`Scheme name mismatch! ${requestSchemeName} !== ${schemeName}`);
  }
}

export async function handleProtocolsRequest() {
  const responseData = { 'schemas': schemeResolver.getRegistedSchemeNames() };
  console.log(responseData);
  return responseData;
}

export async function handleEncryptedProtocolsRequest(encryptionName: string) {
  const encryption = encryptionResolver.getEncryption(encryptionName);
  const encryptedResponse = encryption.encrypt(await handleProtocolsRequest());
  return encryptedResponse;
}

export async function handleRequest(schemeName: SchemeName, schemeMethod: SchemeMethodName, requestBody = undefined): Promise<Object> {
  const scheme = schemeResolver.getScheme(schemeName);
  if (requestBody) {
    console.log(requestBody);
    assertSchemeNameInBodyMatches(requestBody, scheme.getName());
  }
  const responseBody = await scheme.getMethod(schemeMethod)(requestBody);
  console.log(responseBody);
  return responseBody
}

export async function handleEncryptedRequest(encryptionName: EncryptionName, schemeName: SchemeName, schemeMethod: SchemeMethodName, requestBody = undefined): Promise<Object> {
  const encryption = encryptionResolver.getEncryption(encryptionName);
  console.log(requestBody);
  const decryptedRequestBody = (requestBody && requestBody['ciphertext']) ? await encryption.decrypt(requestBody) : undefined;
  const responseBody = await handleRequest(schemeName, schemeMethod, decryptedRequestBody);
  const encryptedResponseBody = await encryption.encrypt(responseBody);
  console.log(encryptedResponseBody)
  return encryptedResponseBody;
}