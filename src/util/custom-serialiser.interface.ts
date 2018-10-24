export interface ICustomSerialiser {
  serialise(object: any): any;
  deserialise(jsonObject: any): any;
}
