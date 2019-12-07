import * as fs from 'fs';

export const NAXOS_PRIVKEY = fs.readFileSync('cert/naxospriv.pem').toString();
export const NAXOS_PUBKEY = fs.readFileSync('cert/naxospub.pem').toString();
