import MclValueWrapper from './MclValueWrapper';
import mcl from './mcl';
import Fr from './Fr';

function serializeG1(value): string {
  return value.getStr(10).slice(2);
}

const GEN_G1 = {
  x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
  y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
};

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

  gen() {
    // Serialized value required here.
    return new G1(`${GEN_G1.x} ${GEN_G1.y}`);
  }
}