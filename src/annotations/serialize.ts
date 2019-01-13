import {Cereal, ICustomSerializer} from '..';
import {Constructor} from '../util/constructor';

export function Serialize(
    // tslint:disable-next-line:no-any
    propertyNameOverride?: string, type?: Constructor<any>|ICustomSerializer):
    (object: {}, propertyName: string) => void {
  return (object: {}, propertyName: string) => {
    const propertySerializationMeta =
        Cereal.metaStore.getClass(object.constructor)
            .getProperty(propertyName)
            .getSerializationMeta();

    propertySerializationMeta.propertyNameOverride = propertyNameOverride;
    propertySerializationMeta.target = type;
  };
}