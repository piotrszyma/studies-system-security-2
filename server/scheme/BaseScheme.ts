import { Scheme, SchemeMethod, SchemeMethodName, SchemeName } from "./Scheme";


export default abstract class BaseScheme implements Scheme {
  abstract getSupportedMethods(): Set<SchemeMethodName>;
  abstract getName(): SchemeName;
  getMethod(name: string): SchemeMethod {
    throw new Error(`Method ${name} is not supported by ${this.getName()}`);
  }
}