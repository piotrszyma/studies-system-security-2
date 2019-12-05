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

  random(): Fr {
    return new Fr();
  }
}