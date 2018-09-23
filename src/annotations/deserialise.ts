import {SerialisationMetaStoreInstance} from '../';
import {Constructor} from '../util/constructor';
import {CustomSerialiser} from '../util/custom-serialiser';

// tslint:disable-next-line:no-any
export function Deserialise(
    propertyNameOverride?: string, type?: Constructor<any>|CustomSerialiser):
    (object: {}, propertyName: string) => void {
  return (object: {}, propertyName: string) => {
    const propertyDeserialisationMeta =
        SerialisationMetaStoreInstance.getMetaGroup(object.constructor)
            .getItemGroup(propertyName)
            .getDeserialisationMeta();

    propertyDeserialisationMeta.propertyNameOverride = propertyNameOverride;
    propertyDeserialisationMeta.type = type;
  };
}