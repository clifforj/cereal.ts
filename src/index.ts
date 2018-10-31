import {SerializationService} from "./service/serialization-service";

export {Deserialize} from './annotations/deserialize';
export {Serialize} from './annotations/serialize';
export {SerializeDeserialize} from './annotations/serialize-deserialize';

// tslint:disable-next-line:variable-name
export const Cereal = new SerializationService();