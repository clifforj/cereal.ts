import {ICustomSerializer} from '..';
import {Constructor} from '../util/constructor';

import {Deserialize} from './deserialize';
import {Serialize} from './serialize';

export function SerializeDeserialize(
    // tslint:disable-next-line:no-any
    propertyNameOverride?: string, type?: Constructor<any>|ICustomSerializer):
    (object: {}, propertyName: string) => void {
  return (object: {}, propertyName: string) => {
    Serialize(propertyNameOverride, type)(object, propertyName);
    Deserialize(propertyNameOverride, type)(object, propertyName);
  };
}