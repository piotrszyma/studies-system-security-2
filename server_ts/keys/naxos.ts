import * as fs from 'fs';
import Fr from '../algebra/Fr';

export const serializedNaxosPrivKey = fs.readFileSync('cert/naxospriv.pem').toString();
export const serializedNaxosPubKey = fs.readFileSync('cert/naxospub.pem').toString();

export const NaxosPrivKey = new Fr(serializedNaxosPrivKey);
export const NaxosPubKey = new Fr(serializedNaxosPubKey);
