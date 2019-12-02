export default interface MclValueWrapper<T> {
  serialize(): string;
  deserialize(value: string): T;
  mcl(): any;
  mul(value: T): T;
  add(value: T): T;
  // random(): T;
}
