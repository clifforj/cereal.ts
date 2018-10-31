import {SerializationMeta} from './serialization-meta';

export class SerializationProperty {
  propertyName: string;
  serializationMeta: SerializationMeta;
  deserializationMeta: SerializationMeta;

  constructor(propertyName: string) {
    this.propertyName = propertyName;
  }

  getSerializationMeta() {
    this.serializationMeta =
        this.serializationMeta || new SerializationMeta();
    return this.serializationMeta;
  }

  getDeserializationMeta() {
    this.deserializationMeta =
        this.deserializationMeta || new SerializationMeta();
    return this.deserializationMeta;
  }
}