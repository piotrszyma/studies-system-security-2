export type SchemeMethod = string;
export type SchemeName = string;

export interface Scheme {
  getSupportedMethods(): Set<SchemeMethod>;
  getName(): SchemeMethod;
}
