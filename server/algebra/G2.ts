import MclValueWrapper from './MclValueWrapper';
import mcl from './mcl';
import Fr from './Fr';
import G1 from './G1';


function serializeG2(value): string {
  return value.getStr(10).slice(2);
}

export default class G2 {

  private mclValue: any;

  constructor();
  constructor(value: string);
  constructor(value: string = undefined) {
    const mclValue = mcl.getG2();
    if (value) mclValue.setStr(`1 ${value}`);
    this.mclValue = mclValue;
  }

  deserialize(serializedValue: string): G2 {
    return new G2(serializedValue);
  }

  serialize(): string {
    return serializeG2(this.mclValue);
  }

  add(value: G1 | G2): G2 {
    const result = this.mclValue.add(value.mcl());
    return new G2(serializeG2(result));
  }

  mul(value: Fr): G2 {
    const result = this.mclValue.mul(value.mcl());
    return new G2(serializeG2(result));
  }

  mcl() {
    return this.mclValue;
  }

  setMcl(value) {
    this.mclValue = value;
  }

  hashAndMapTo(value: string) {
    const result = mcl.getHashMapG2()(value);
    return new G2(serializeG2(result));
  }
}