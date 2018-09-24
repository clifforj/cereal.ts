import {Constructor} from '../util/constructor';
import {CustomSerialiser} from '../util/custom-serialiser';
import {Cereal} from '..';

// tslint:disable-next-line:no-any
export function Deserialise(
    propertyNameOverride?: string, type?: Constructor<any>|CustomSerialiser):
    (object: {}, propertyName: string) => void {
  return (object: {}, propertyName: string) => {
    const propertyDeserialisationMeta =
        Cereal.metaStore.getClass(object.constructor)
            .getItemGroup(propertyName)
            .getDeserialisationMeta();

    propertyDeserialisationMeta.propertyNameOverride = propertyNameOverride;
    propertyDeserialisationMeta.target = type;
  };
}