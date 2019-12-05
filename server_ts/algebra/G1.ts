import MclValueWrapper from './MclValueWrapper';
import mcl from './mcl';
import Fr from './Fr';
import G2 from './G2';

function serializeG1(value): string {
  return value.getStr(10).slice(2);
}

const GEN_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
};


const GEN_G2 = {
  x: '2144250947445192081071618466765046647019257686245947349033844530891338159027816696711238671324221321317530545114427',
  y: '2665798332422762660334686159210698639947668680862640755137811598895238932478193747736307724249253853210778728799013',
}

export default class G1 {

  private mclValue: any;

  constructor();
  constructor(value: string);
  constructor(value: string = undefined) {
    const mclValue = mcl.getG1();
    if (value) mclValue.setStr(`1 ${value}`);
    this.mclValue = mclValue;
  }

  deserialize(serializedValue: string): G1 {
    return new G1(serializedValue);
  }

  serialize(): string {
    return serializeG1(this.mclValue);
  }

  add(value: G1): G1 {
    const result = mcl.getAdd()(this.mclValue, value.mcl());
    return new G1(serializeG1(result));
  }

  mul(value: Fr): G1 {
    const result = mcl.getMul()(this.mclValue, value.mcl());
    return new G1(serializeG1(result));
  }

  mcl() {
    return this.mclValue;
  }

  getG1() {
    return new G1(/* DO NOT PUT 1 HERE */`${GEN_G1.x} ${GEN_G1.y}`);
  }

  getG2() {
    return new G1(/* DO NOT PUT 1 HERE */`${GEN_G2.x} ${GEN_G2.y}`);
  }

  // TODO: Create a wrapper for it.
  pairing(value: G2): any {
    return mcl.getPairing()(this.mcl(), value.mcl());
  }

  hashAndMapTo(value: string) {
    const result = mcl.getHashMapG1()(value);
    return new G2(serializeG1(result));
  }
}