import * as fs from 'fs';

export const CHACHA_KEY = fs.readFileSync('cert/chacha_key.bin');