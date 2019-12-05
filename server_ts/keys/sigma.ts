import * as fs from 'fs';

export const serializedSigmaPrivKey = fs.readFileSync('cert/sigmapriv.pem').toString();
export const serializedSigmaPubKey = fs.readFileSync('cert/sigmapub.pem').toString();
