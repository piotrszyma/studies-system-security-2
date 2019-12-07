import { EncryptionName, Encryption } from "./Encryption";


export default class EncryptionResolver {
  private registeredEncryptions: Map<EncryptionName, Encryption>;

  constructor() {
    this.registeredEncryptions = new Map();
  }

  getEncryption(encryptionName: EncryptionName) {
    const scheme = <Encryption>this.registeredEncryptions.get(encryptionName);
    if (!scheme) throw new Error(`Scheme ${encryptionName} is not supported`);
    return scheme;
  }

  register(encryption: Encryption) {
    this.registeredEncryptions.set(encryption.getName(), encryption);
  }

  getRegisteredEncryptionNames(): Array<EncryptionName> {
    return [...this.registeredEncryptions.keys()];
  }
}
