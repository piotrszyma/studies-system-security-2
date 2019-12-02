import MclValueWrapper from './MclValueWrapper';
import mcl from './mcl';

function serializeG2(value): string {
  return value.getStr(10).slice(2);
}

export default class G2 implements MclValueWrapper<G2> {

  private mclValue: any;

  constructor(value: string) {
    const mclValue = mcl.getG2();
    mclValue.setStr(`1 ${value}`);
    this.mclValue = mclValue;
  }

  deserialize(serializedValue: string): G2 {
    return new G2(serializedValue);
  }

  serialize(): string {
    return serializeG2(this.mclValue);
  }

  add(value: G2): G2 {
    const result = this.mclValue.add(value.mcl());
    return new G2(serializeG2(result));
  }

  mul(value: G2): G2 {
    const result = this.mclValue.mul(value.mcl());
    return new G2(serializeG2(result));
  }

  mcl() {
    return this.mclValue;
  }
}