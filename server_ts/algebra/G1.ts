import MclValueWrapper from './MclValueWrapper';
import mcl from './mcl';

function serializeG1(value): string {
  return value.getStr(10).slice(2);
}

export default class G1 implements MclValueWrapper<G1> {

  private mclValue: any;

  constructor(value: string) {
    const mclValue = mcl.getG1();
    mclValue.setStr(`1 ${value}`);
    this.mclValue = mclValue;
  }

  deserialize(serializedValue: string): G1 {
    return new G1(serializedValue);
  }

  serialize(): string {
    return serializeG1(this.mclValue);
  }

  add(value: G1): G1 {
    const result = this.mclValue.add(value.mcl());
    return new G1(serializeG1(result));
  }

  mul(value: G1): G1 {
    const result = this.mclValue.mul(value.mcl());
    return new G1(serializeG1(result));
  }

  mcl() {
    return this.mclValue;
  }
}