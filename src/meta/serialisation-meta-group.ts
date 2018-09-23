import {SerialisationMetaItemGroup} from './serialisation-meta-item-group';

export class SerialisationMetaGroup {
  items: Map<string, SerialisationMetaItemGroup> =
      new Map<string, SerialisationMetaItemGroup>();

  getItemGroup(propertyName: string): SerialisationMetaItemGroup {
    let result = this.items.get(propertyName);

    if (!result) {
      result = new SerialisationMetaItemGroup(propertyName);
      this.items.set(propertyName, result);
    }

    return result;
  }
}