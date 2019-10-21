const mcl = require('mcl-wasm');
const { CONST_G1 } = require('../consts');

async function protocolExecutionExample() {
  await mcl.init(mcl.BLS12_381);

  // Client generates q1, a, x, calculates A, X and sends them to server.
  const g1 = new mcl.G1();
  g1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const a = new mcl.Fr();
  a.setByCSPRNG();
  const A = mcl.mul(g1, a);
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const X = mcl.mul(g1, x);

  // Server receives A, X and calculates c and sends c to client.
  const c = new mcl.Fr();
  c.setByCSPRNG();

  // Client receives c, calculates s and sends to server.
  const s = mcl.add(x, mcl.mul(a, c))

  // Server receives s, calculates g1^s, XA^c.

  const S = mcl.mul(g1, s);
  const AC = mcl.mul(A, c);
  const XAC = mcl.add(X, AC);

  if (S.getStr() == XAC.getStr()) {
    console.log("Accepted");
  } else {
    console.log("Rejected");
  }
}


protocolExecutionExample();
