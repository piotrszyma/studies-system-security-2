export type EncryptionName = string;
export interface Encryption {
  getName(): EncryptionName;
  encrypt(params: Object): Promise<Object>;
  decrypt(params: Object): Promise<Object>;
};
