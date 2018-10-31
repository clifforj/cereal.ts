import {SerializationClass} from './serialization-class';

export class SerializationMetaStore {
  store: Map<Function, SerializationClass> =
      new Map<Function, SerializationClass>();

  getClass(groupClass: Function): SerializationClass {
    let result = this.store.get(groupClass);

    if (!result) {
      result = new SerializationClass();
      this.store.set(groupClass, result);
    }

    return result;
  }
}