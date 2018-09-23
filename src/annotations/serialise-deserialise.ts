import {Constructor} from '../util/constructor';
import {CustomSerialiser} from '../util/custom-serialiser';

import {Deserialise} from './deserialise';
import {Serialise} from './serialise';

// tslint:disable-next-line:no-any
export function SerialiseDeserialise(
    propertyNameOverride?: string, type?: Constructor<any>|CustomSerialiser):
    (object: {}, propertyName: string) => void {
  return (object: {}, propertyName: string) => {
    Serialise(propertyNameOverride, type)(object, propertyName);
    Deserialise(propertyNameOverride, type)(object, propertyName);
  };
}
// tslint:disable-next-line:variable-name
export const SerializeDeserialize = SerialiseDeserialise;