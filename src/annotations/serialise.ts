import {Constructor} from '../util/constructor';
import {CustomSerialiser} from '../util/custom-serialiser';
import {Cereal} from '..';

// tslint:disable-next-line:no-any
export function Serialise(
    propertyNameOverride?: string, type?: Constructor<any>|CustomSerialiser):
    (object: {}, propertyName: string) => void {
  return (object: {}, propertyName: string) => {
    const propertySerialisationMeta =
        Cereal.metaStore.getClass(object.constructor)
            .getItemGroup(propertyName)
            .getSerialisationMeta();

    propertySerialisationMeta.propertyNameOverride = propertyNameOverride;
    propertySerialisationMeta.target = type;
  };
}