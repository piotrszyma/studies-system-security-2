import { SchemeName, SchemeMethod, SchemeMethodName } from './Scheme';
import BaseScheme from './BaseScheme';

export default class SchemeResolver {
  private registeredSchemes: Map<SchemeName, BaseScheme>;

  constructor() {
    this.registeredSchemes = new Map();
  }

  getScheme(schemeName: SchemeName) {
    const scheme = <BaseScheme>this.registeredSchemes.get(schemeName);
    if (!scheme) throw new Error(`Scheme ${schemeName} is not supported`);
    return scheme;
  }

  register(scheme: BaseScheme) {
    this.registeredSchemes.set(scheme.getName(), scheme);
  }

  getRegistedSchemeNames(): Array<SchemeName> {
    return [...this.registeredSchemes.keys()];
  }
}
