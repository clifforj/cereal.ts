import {SerialisationClass} from './serialisation-class';

export class SerialisationMetaStore {
  store: Map<Function, SerialisationClass> =
      new Map<Function, SerialisationClass>();

  getClass(groupClass: Function): SerialisationClass {
    let result = this.store.get(groupClass);

    if (!result) {
      result = new SerialisationClass();
      this.store.set(groupClass, result);
    }

    return result;
  }
}