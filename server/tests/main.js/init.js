const mcl = require('mcl-wasm');


(async function () {
  await mcl.init(mcl.BLS12_381);


})
// a = new mcl.Fr();
// const a = mcl.Fr()
// a.setByCSPRNG()

// a = new mcl.Fr();

function main() {
  const a = new mcl.Fr()
}

main();


// console.log(a.serializeToHexStr());