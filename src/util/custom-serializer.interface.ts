export interface ICustomSerializer {
  // tslint:disable-next-line:no-any
  serialize?: (object: any) => any;
  // tslint:disable-next-line:no-any
  deserialize?: (jsonObject: any) => any;
}
