import {Constructor} from '../util/constructor';
import {ICustomSerializer} from '../util/custom-serializer.interface';

export class SerializationMeta {
  propertyNameOverride: string;
  // tslint:disable-next-line:no-any
  target: Constructor<any>|ICustomSerializer;
}