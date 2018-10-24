import {Constructor} from '../util/constructor';
import {ICustomSerialiser} from '../util/custom-serialiser.interface';
import {Cereal} from '..';

// tslint:disable-next-line:no-any
export function Serialise(
    propertyNameOverride?: string, type?: Constructor<any>|ICustomSerialiser):
    (object: {}, propertyName: string) => void {
  return (object: {}, propertyName: string) => {
    const propertySerialisationMeta =
        Cereal.metaStore.getClass(object.constructor)
            .getProperty(propertyName)
            .getSerialisationMeta();

    propertySerialisationMeta.propertyNameOverride = propertyNameOverride;
    propertySerialisationMeta.target = type;
  };
}