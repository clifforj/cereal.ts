import {Constructor} from '../util/constructor';
import {ICustomSerialiser} from '../util/custom-serialiser.interface';

export class SerialisationMeta {
  propertyNameOverride: string;
  // tslint:disable-next-line:no-any
  target: Constructor<any>|ICustomSerialiser;
}