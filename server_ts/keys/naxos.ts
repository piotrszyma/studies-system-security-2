import * as fs from 'fs';

export const serializedNaxosPrivKey = fs.readFileSync('cert/naxospriv.pem').toString();
export const serializedNaxosPubKey = fs.readFileSync('cert/naxospub.pem').toString();
