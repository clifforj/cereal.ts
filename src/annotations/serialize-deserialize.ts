import {Constructor} from '../util/constructor';
import {ICustomSerializer} from '../util/custom-serializer.interface';

import {Deserialize} from './deserialize';
import {Serialize} from './serialize';

// tslint:disable-next-line:no-any
export function SerializeDeserialize(
    propertyNameOverride?: string,
    type?: Constructor<any>|ICustomSerializer
  ): (object: {}, propertyName: string) => void {
    return (object: {}, propertyName: string) => {
      Serialize(propertyNameOverride, type)(object, propertyName);
      Deserialize(propertyNameOverride, type)(object, propertyName);
    };
}