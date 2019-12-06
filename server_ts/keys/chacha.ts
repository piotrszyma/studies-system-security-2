import * as fs from 'fs';

export const chachaKey = fs.readFileSync('cert/chacha_key.bin');