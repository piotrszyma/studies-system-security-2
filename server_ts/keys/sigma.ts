import * as fs from 'fs';
import Fr from '../algebra/Fr';

export const serializedSigmaPrivKey = fs.readFileSync('cert/sigmapriv.pem').toString();
export const serializedSigmaPubKey = fs.readFileSync('cert/sigmapub.pem').toString();

export const sigmaPrivKey = new Fr(serializedSigmaPrivKey);
export const sigmaPubKey = new Fr(serializedSigmaPubKey);
