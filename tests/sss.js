const mcl = require('mcl-wasm');
const axios = require('axios');
const crypto = require('crypto');

const CONST_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
}

function getHash(value) {
  const hasher = crypto.createHash('sha3-256');
  hasher.update(value);
  return hasher.getHash();
}

async function testVerifiesValidMessage() {
  await mcl.init(mcl.BLS12_381);
  const G1 = new mcl.G1();
  G1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const a = new mcl.Fr();
  a.setByCSPRNG();
  const A = mcl.mul(G1, a);
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const X = mcl.mul(G1, x);

  const c = mcl.Fr()

  const message = 'test';

  const msgHash = getHash(message);
  // c.setStr()

  const ac = mcl.mul(a, c);
  const s = mcl.add(ac, x);

  c.setByCSPRNG();




  const message = 'test';

}

async function main() {
  await testVerifiesValidMessage();
}

main();