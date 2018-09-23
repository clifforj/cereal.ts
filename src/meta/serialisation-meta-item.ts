import {Constructor} from '../util/constructor';
import {CustomSerialiser} from '../util/custom-serialiser';

export class SerialisationMetaItem {
  propertyNameOverride: string;
  // tslint:disable-next-line:no-any
  type: Constructor<any>|CustomSerialiser;
}