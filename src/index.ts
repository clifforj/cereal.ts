import {SerializationService} from './service/serialization-service';

export {Deserialize} from './annotations/deserialize';
export {Serialize} from './annotations/serialize';
export {SerializeDeserialize} from './annotations/serialize-deserialize';
export {ICustomSerializer} from './util/custom-serializer.interface';

// tslint:disable-next-line:variable-name
export const Cereal = new SerializationService();