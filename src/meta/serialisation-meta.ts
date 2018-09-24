import {Constructor} from '../util/constructor';
import {CustomSerialiser} from '../util/custom-serialiser';

export class SerialisationMeta {
  propertyNameOverride: string;
  // tslint:disable-next-line:no-any
  target: Constructor<any>|CustomSerialiser;
}