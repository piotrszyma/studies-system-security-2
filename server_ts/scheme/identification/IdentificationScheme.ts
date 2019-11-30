import { Scheme, SchemeName } from "../Scheme";

export default abstract class IdentificationScheme implements Scheme {
  getSupportedMethods() {
    return new Set(['init', 'verify']);
  }

  abstract getName(): SchemeName;
  abstract init(params: Object): Object;
  abstract verify(params: Object): Object;
}