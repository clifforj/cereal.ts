import {SerialisationProperty} from './serialisation-property';

export class SerialisationClass {
  properties: Map<string, SerialisationProperty> =
      new Map<string, SerialisationProperty>();

  getItemGroup(propertyName: string): SerialisationProperty {
    let result = this.properties.get(propertyName);

    if (!result) {
      result = new SerialisationProperty(propertyName);
      this.properties.set(propertyName, result);
    }

    return result;
  }
}