const mcl = require('mcl-wasm');
const config = require('../../config');

const CONST_G1 = config.points.g1;

async function protocolExecutionExample() {
  await mcl.init(mcl.BLS12_381);

  // Client generates Q, a, x, calculates A, X and sends them to server.
  const g1 = new mcl.G1();
  g1.setStr(`1 ${CONST_G1.x} ${CONST_G1.y}`);
  const a = new mcl.Fr();
  a.setByCSPRNG();
  const A = mcl.mul(g1, a);
  const x = new mcl.Fr();
  x.setByCSPRNG();
  const X = mcl.mul(g1, x);

  // const Q = mcl.hashAndMapToG2('genQ');
  // console.log(`Q: ${Q.getStr().slice(2)}`);
  // const a = new mcl.Fr();
  // a.setByCSPRNG()
  // const A = mcl.mul(Q, a);

  // const x = new mcl.Fr();
  // x.setByCSPRNG();
  // const X = mcl.mul(Q, x);

  // Server receives A, X and calculates c and sends c to client.
  const c = new mcl.Fr();
  c.setByCSPRNG();

  // Client receives c, calculates S, gHat and sends to server.
  const gHat = mcl.hashAndMapToG2(X.getStr(10).slice(2) + c.getStr(10));
  const S = mcl.mul(gHat, mcl.add(x, mcl.mul(a, c)));

  // Server receives S, calculates gHat, pairings and compares e1 & e2.
  // gHat = mcl.hashAndMapToG2(X.getStr(10).slice(2) + c.getStr(10));

  const AC = mcl.mul(A, c)
  const XAC = mcl.add(X, AC)

  const e1 = mcl.pairing(g1, S)
  const e2 = mcl.pairing(XAC, gHat)

  if (e1.getStr() == e2.getStr()) {
    console.log("Accepted");
  } else {
    console.log("Rejected");
  }
}


protocolExecutionExample();
