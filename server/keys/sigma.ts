import * as fs from 'fs';

export const SIGMA_PRIVKEY = fs.readFileSync('cert/sigmapriv.pem').toString();
export const SIGMA_PUBKEY = fs.readFileSync('cert/sigmapub.pem').toString();
