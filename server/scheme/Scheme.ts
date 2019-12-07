export type SchemeMethodName = string;
export type SchemeName = string;
export type SchemeMethod = (params: Object) => Object;

export interface Scheme {
  getSupportedMethods(): Set<SchemeMethodName>;
  getName(): SchemeName;
}
