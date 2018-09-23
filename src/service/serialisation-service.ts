import {SerialisationMetaStoreInstance} from '..';
import {Constructor} from '../util/constructor';
import {CustomSerialiser} from '../util/custom-serialiser';

export class SerialisationService {
  // tslint:disable-next-line:no-any
  serialise(object: any, type: Constructor<any>|CustomSerialiser) {
    // tslint:disable-next-line:no-any
    let serialisedObject: any = {};

    if (type && !this.isCustomSerialiser(type)) {
      const functionSerialisationMeta =
          SerialisationMetaStoreInstance.getMetaGroup(type);

      functionSerialisationMeta.items.forEach((metaItem) => {
        const serialisationMeta = metaItem.getSerialisationMeta();
        const serialisedPropertyName =
            serialisationMeta.propertyNameOverride || metaItem.propertyName;

        serialisedObject[serialisedPropertyName] = this.serialise(
            object[metaItem.propertyName], serialisationMeta.type);
      });
    } else if (type && this.isCustomSerialiser(type)) {
      serialisedObject = type.serialise(object);
    } else {
      serialisedObject = object;
    }

    return serialisedObject;
  }

  // tslint:disable-next-line:no-any
  deserialise(object: any, type: Constructor<any>|CustomSerialiser) {
    // tslint:disable-next-line:no-any
    let deserialisedObject: any;

    if (type && !this.isCustomSerialiser(type)) {
      // tslint:disable-next-line:no-any
      type = type as Constructor<any>;
      const functionSerialisationMeta =
          SerialisationMetaStoreInstance.getMetaGroup(type);

      deserialisedObject = new type();
      functionSerialisationMeta.items.forEach((metaItem) => {
        const deserialisationMeta = metaItem.getDeserialisationMeta();
        const deserialisedPropertyName =
            deserialisationMeta.propertyNameOverride || metaItem.propertyName;

        deserialisedObject[metaItem.propertyName] = this.deserialise(
            object[deserialisedPropertyName], deserialisationMeta.type);
      });
    } else if (type && this.isCustomSerialiser(type)) {
      deserialisedObject = type.deserialise(object);
    } else {
      deserialisedObject = object;
    }

    return deserialisedObject;
  }

  isCustomSerialiser(type: object): type is CustomSerialiser {
    return 'serialise' in type || 'deserialise' in type;
  }
}
// tslint:disable-next-line:variable-name
export const SerialisationServiceInstance = new SerialisationService();