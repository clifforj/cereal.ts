import {SerializationProperty} from './serialization-property';

export class SerializationClass {
  properties: Map<string, SerializationProperty> =
      new Map<string, SerializationProperty>();

  getProperty(propertyName: string): SerializationProperty {
    let result = this.properties.get(propertyName);

    if (!result) {
      result = new SerializationProperty(propertyName);
      this.properties.set(propertyName, result);
    }

    return result;
  }
}