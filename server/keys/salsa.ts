import * as fs from 'fs';

export const SALSA_KEY = fs.readFileSync('cert/salsa_key.bin');