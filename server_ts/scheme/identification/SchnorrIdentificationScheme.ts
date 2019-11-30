import IdentificationScheme from "./IdentificationScheme";
import { SchemeName } from "../Scheme";


export default class SchnorrIdentificationScheme extends IdentificationScheme {
  getName(): SchemeName {
    return 'sis';
  }

  init(params: Object): Object {
    return {};
  }

  verify(params: Object): Object {
    return {};
  }

}