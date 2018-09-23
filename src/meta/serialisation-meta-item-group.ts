import {SerialisationMetaItem} from './serialisation-meta-item';

export class SerialisationMetaItemGroup {
  propertyName: string;
  serialisationMeta: SerialisationMetaItem;
  deserialisationMeta: SerialisationMetaItem;

  constructor(propertyName: string) {
    this.propertyName = propertyName;
  }

  getSerialisationMeta() {
    this.serialisationMeta =
        this.serialisationMeta || new SerialisationMetaItem();
    return this.serialisationMeta;
  }

  getDeserialisationMeta() {
    this.deserialisationMeta =
        this.deserialisationMeta || new SerialisationMetaItem();
    return this.deserialisationMeta;
  }
}