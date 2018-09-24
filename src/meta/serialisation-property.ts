import {SerialisationMeta} from './serialisation-meta';

export class SerialisationProperty {
  propertyName: string;
  serialisationMeta: SerialisationMeta;
  deserialisationMeta: SerialisationMeta;

  constructor(propertyName: string) {
    this.propertyName = propertyName;
  }

  getSerialisationMeta() {
    this.serialisationMeta =
        this.serialisationMeta || new SerialisationMeta();
    return this.serialisationMeta;
  }

  getDeserialisationMeta() {
    this.deserialisationMeta =
        this.deserialisationMeta || new SerialisationMeta();
    return this.deserialisationMeta;
  }
}