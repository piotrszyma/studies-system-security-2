import { SchemeName, Scheme } from './Scheme';

class SchemeResolver {
  private registeredSchemes: Map<SchemeName, Scheme>;

  resolve(schemeName: string, phase: string): Scheme {
    return this.registeredSchemes.get(schemeName);
  }

  register() { }
}