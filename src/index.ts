import {SerialisationService} from "./service/serialisation-service";

export {Deserialise} from './annotations/deserialise';
export {Serialise} from './annotations/serialise';
export {SerialiseDeserialise} from './annotations/serialise-deserialise';

// tslint:disable-next-line:variable-name
export const Cereal = new SerialisationService();