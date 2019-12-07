const mcl = require('mcl-wasm');
const mclUtils = require('../server/crypto/mcl-utils');

async function testHash() {
  await mcl.init(mcl.BLS12_381);

  const h = '43367168318456247250204590668540639305897124473494679638616443561445935821123'
  const X = '2310888095149737337217923523629445780544194534761478148477499161492697135588944467993502478091895371195521220672546 146556323908717558218861176985422492520688449338666340443803629836318295588445048148832864848098899369717088156514'
  const msg = 'Sign this';

  const H = new mcl.Fr();
  H.setStr(h);
  const XX = new mcl.G1();
  XX.setStr(`1 ${X}`);
  const intHash = mclUtils.hash(msg + X);

  const intHashFr = new mcl.Fr();
  intHashFr.setInt(intHash);
  console.log(intHash.toString() === h);
  // H.setInt(intHash);
  // console.log(H.getStr(10));
}


testHash();