import {Constructor} from '../util/constructor';
import {ICustomSerializer} from '../util/custom-serializer.interface';
import {Cereal} from '..';

// tslint:disable-next-line:no-any
export function Serialize(
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