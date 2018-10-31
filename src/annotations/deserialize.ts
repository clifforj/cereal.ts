import {Constructor} from '../util/constructor';
import {ICustomSerializer} from '../util/custom-serializer.interface';
import {Cereal} from '..';

// tslint:disable-next-line:no-any
export function Deserialize(
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