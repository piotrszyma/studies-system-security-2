const mcl = require('mcl-wasm');
let mclInstance = null;

new Promise(async (resolve) => {
  await mcl.init(mcl.BLS12_381);
  new mcl.Fr().setByCSPRNG();
  new mcl.G1();
  new mcl.G2();
  mclInstance = mcl;
  console.log('mcl-wasm loaded');
  resolve();
})

export default {
  getFr: () => new mclInstance.Fr(),
  getG1: () => new mclInstance.G1(),
  getG2: () => new mclInstance.G2(),
  getMul: () => mclInstance.mul,
  getAdd: () => mclInstance.add,
  getHashMapG1: () => mclInstance.hashAndMapToG1,
  getHashMapG2: () => mclInstance.hashAndMapToG2,
  getPairing: () => mclInstance.pairing,
  getNeg: () => mclInstance.neg,
}