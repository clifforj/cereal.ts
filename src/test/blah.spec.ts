import 'mocha';

import {expect} from 'chai';

import {Deserialise, SerialisationMetaStoreInstance, Serialise} from '../';
import {SerialiseDeserialise, SerializeDeserialize} from '../annotations/serialise-deserialise';
import {SerialisationServiceInstance} from '../service/serialisation-service';
import {CustomSerialiser} from '../util/custom-serialiser';

class MahSerialiserImpl implements CustomSerialiser {
  serialise() {
    console.log('scoot scoot scoot');
  }
  deserialise() {
    console.log('doot doot doot');
  }
}
const mahSerialiser = new MahSerialiserImpl();

class Car {
  @Serialise('color') make: string;

  getMake() {
    return this.make;
  }
}

class Person {
  @SerializeDeserialize('namefirst') firstName: string;
  @SerialiseDeserialise('namelast') lastName: string;
  @SerialiseDeserialise(null, Car) car: Car;
  @Deserialise(null, mahSerialiser) isFass: boolean;
}

describe('Hello function', () => {
  it('should return hello world', () => {
    SerialisationMetaStoreInstance.logContents();

    const result = true;
    expect(true).to.equal(true);

    const person = new Person();
    person.firstName = 'John';
    person.lastName = 'C';

    const car = new Car();
    car.make = 'blue';

    person.car = car;

    const personJson = SerialisationServiceInstance.serialise(person, Person);
    console.log(personJson);
    const repPerson =
        SerialisationServiceInstance.deserialise(personJson, Person);
    console.log(repPerson.car.getMake());
  });

  it('should have a check for custom serialisers', () => {
    expect(SerialisationServiceInstance.isCustomSerialiser(mahSerialiser))
        .to.equal(true);
  });
});