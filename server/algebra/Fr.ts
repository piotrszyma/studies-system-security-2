import MclValueWrapper from './MclValueWrapper';
import mcl from './mcl';

function serializeFr(value): string {
  return value.getStr(10);
}

export default class Fr {

  private mclValue: any;

  constructor();
  constructor(value: string);
  constructor(value: string = undefined) {
    const mclValue = mcl.getFr();

    if (value) {
      mclValue.setStr(`${value}`);
    } else {
      mclValue.setByCSPRNG();
    }
    this.mclValue = mclValue;
  }

  deserialize(serializedValue: string): Fr {
    return new Fr(serializedValue);
  }

  serialize(): string {
    return serializeFr(this.mclValue);
  }

  add(value: Fr): Fr {
    const result = mcl.getAdd()(this.mclValue, value.mcl());
    return new Fr(serializeFr(result));
  }

  mul(value: Fr): Fr {
    const result = mcl.getMul()(this.mclValue, value.mcl());
    return new Fr(serializeFr(result));
  }

  mcl() {
    return this.mclValue;
  }

  setMcl(value) {
    this.mclValue = value;
  }

  random(): Fr {
    return new Fr();
  }

  fromHash(hash: string): Fr {
    const result = new Fr();
    result.mcl().setStr(hash);
    return result;
  }

  neg() {
    const result = new Fr();
    result.setMcl(mcl.getNeg()(this.mcl()));
    return result;
  }

  equals(value: Fr): boolean {
    return this.mcl().getStr() === value.mcl().getStr();
  }
}