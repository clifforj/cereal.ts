import {Constructor} from '../util/constructor';
import {ICustomSerialiser} from '../util/custom-serialiser.interface';
import {Cereal} from '..';

// tslint:disable-next-line:no-any
export function Deserialise(
    propertyNameOverride?: string, type?: Constructor<any>|ICustomSerialiser):
    (object: {}, propertyName: string) => void {
  return (object: {}, propertyName: string) => {
    const propertyDeserialisationMeta =
        Cereal.metaStore.getClass(object.constructor)
            .getProperty(propertyName)
            .getDeserialisationMeta();

    propertyDeserialisationMeta.propertyNameOverride = propertyNameOverride;
    propertyDeserialisationMeta.target = type;
  };
}