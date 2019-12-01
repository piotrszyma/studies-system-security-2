import { Scheme, SchemeName } from "../Scheme";
import BaseScheme from "../BaseScheme";

export default abstract class IdentificationScheme extends BaseScheme {
  getSupportedMethods() {
    return new Set(['init', 'verify']);
  }

  abstract getName(): SchemeName;
  abstract init(params: Object): Object;
  abstract verify(params: Object): Object;
}