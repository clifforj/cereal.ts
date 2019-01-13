import {Cereal, ICustomSerializer} from '..';
import {Constructor} from '../util/constructor';

export function Deserialize(
    // tslint:disable-next-line:no-any
    propertyNameOverride?: string, type?: Constructor<any>|ICustomSerializer):
    (object: {}, propertyName: string) => void {
  return (object: {}, propertyName: string) => {
    const propertyDeserializationMeta =
        Cereal.metaStore.getClass(object.constructor)
            .getProperty(propertyName)
            .getDeserializationMeta();

    propertyDeserializationMeta.propertyNameOverride = propertyNameOverride;
    propertyDeserializationMeta.target = type;
  };
}