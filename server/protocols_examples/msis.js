const mcl = require('mcl-wasm');

async function protocolExecutionExample() {
  await mcl.init(mcl.BLS12_381);

  // Client generates Q, a, x, calculates A, X and sends them to server.
  const Q = mcl.hashAndMapToG2('genQ');
  console.log(`Q: ${Q.getStr().slice(2)}`);
  const a = new mcl.Fr();
  a.setByCSPRNG()
  const A = mcl.mul(Q, a);

  const x = new mcl.Fr();
  x.setByCSPRNG();
  const X = mcl.mul(Q, x);

  // Server receives A, X and calculates c and sends c to client.
  const c = new mcl.Fr();
  c.setByCSPRNG();

  // Client receives c, calculates s, U and sends to server.
  const s = mcl.add(x, mcl.mul(a, c))
  const U = mcl.hashAndMapToG1(X.serializeToHexStr() + c.serializeToHexStr());

  // Server receives s, U, calculates pairings and compares e1 & e2.
  const S = mcl.mul(U, s);
  const AC = mcl.mul(A, c)
  const XAC = mcl.add(X, AC)

  const e1 = mcl.pairing(S, Q)
  const e2 = mcl.pairing(U, XAC)

  if (e1.getStr() == e2.getStr()) {
    console.log("Accepted");
  } else {
    console.log("Rejected");
  }
}


protocolExecutionExample();
