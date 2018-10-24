import {Constructor} from '../util/constructor';
import {ICustomSerialiser} from '../util/custom-serialiser.interface';

import {Deserialise} from './deserialise';
import {Serialise} from './serialise';

// tslint:disable-next-line:no-any
export function SerialiseDeserialise(
    propertyNameOverride?: string, type?: Constructor<any>|ICustomSerialiser):
    (object: {}, propertyName: string) => void {
  return (object: {}, propertyName: string) => {
    Serialise(propertyNameOverride, type)(object, propertyName);
    Deserialise(propertyNameOverride, type)(object, propertyName);
  };
}
// tslint:disable-next-line:variable-name
export const SerializeDeserialize = SerialiseDeserialise;