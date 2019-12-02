import * as mcl from 'mcl-wasm';
import MclValueWrapper from './MclValueWrapper';

export default class Fr implements MclValueWrapper<Fr> {

  private mclValue: any;

  constructor();
  constructor(value: string);
  constructor(value: string = undefined) {
    const mclValue = new mcl.Fr();
    if (typeof value === 'undefined') {
      mclValue.setByCPRNG();
    } else {
      mclValue.setStr(value);
    }
    this.mclValue = mclValue;
  }

  deserialize(value: string) {
    return new Fr(value);
  }

  serialize() {
    return this.mclValue.getStr(10);
  }

  add(value: Fr): Fr {
    const result = this.mclValue.add(value.getMclValue());
    return new Fr(result.getStr(10));
  }

  mul(value: Fr): Fr {
    const result = this.mclValue.mul(value.getMclValue());
    return new Fr(result.getStr(10));
  }

  getMclValue() {
    return this.mclValue;
  }

  random(): Fr {
    return new Fr();
  }
}