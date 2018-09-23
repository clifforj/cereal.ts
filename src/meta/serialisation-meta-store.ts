import {SerialisationMetaGroup} from './serialisation-meta-group';

export class SerialisationMetaStore {
  store: Map<Function, SerialisationMetaGroup> =
      new Map<Function, SerialisationMetaGroup>();

  getMetaGroup(groupClass: Function): SerialisationMetaGroup {
    let result = this.store.get(groupClass);

    if (!result) {
      result = new SerialisationMetaGroup();
      this.store.set(groupClass, result);
    }

    return result;
  }

  logContents() {
    this.store.forEach((group, classRef) => {
      console.log(`${classRef.name}`);
      group.items.forEach((itemGroup, key) => {
        console.log(`- ${itemGroup.propertyName}`);
        console.log('-  SERIALISATION');
        console.log(`-    Override: ${
            itemGroup.getSerialisationMeta().propertyNameOverride}`);
        console.log(`-    Type: ${itemGroup.getSerialisationMeta().type}`);
        console.log('-  DESERIALISATION');
        console.log(`-    Override: ${
            itemGroup.getDeserialisationMeta().propertyNameOverride}`);
        console.log(`-    Type: ${itemGroup.getDeserialisationMeta().type}`);
      });
      console.log();
    });
  }
}
// tslint:disable-next-line:variable-name
export const SerialisationMetaStoreInstance = new SerialisationMetaStore();