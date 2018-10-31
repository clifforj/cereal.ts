export interface ICustomSerializer {
  serialize(object: any): any;
  deserialize(jsonObject: any): any;
}
