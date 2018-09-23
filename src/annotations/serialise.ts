import {SerialisationMetaStoreInstance} from '../meta/serialisation-meta-store';
import {Constructor} from '../util/constructor';
import {CustomSerialiser} from '../util/custom-serialiser';

// tslint:disable-next-line:no-any
export function Serialise(
    propertyNameOverride?: string, type?: Constructor<any>|CustomSerialiser):
    (object: {}, propertyName: string) => void {
  return (object: {}, propertyName: string) => {
    const propertySerialisationMeta =
        SerialisationMetaStoreInstance.getMetaGroup(object.constructor)
            .getItemGroup(propertyName)
            .getSerialisationMeta();

    propertySerialisationMeta.propertyNameOverride = propertyNameOverride;
    propertySerialisationMeta.type = type;
  };
}