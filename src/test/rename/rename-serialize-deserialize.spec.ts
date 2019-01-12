import 'mocha';

import {expect} from 'chai';

import {Cereal, SerializeDeserialize} from '../../';

class Person {
  @SerializeDeserialize('first_name') firstName: string;
  @SerializeDeserialize('last_name') lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

describe('Renamed Property Serialization / Deserialization', () => {
  const bruce = new Person('Bruce', 'Bogtrotter');

  it('should serialize / deserialize based on given class', () => {
    const serialBruce = Cereal.serialize(bruce, Person);

    expect(serialBruce).to.not.equal(bruce);
    expect(serialBruce['first_name']).to.equal('Bruce');
    expect(serialBruce['last_name']).to.equal('Bogtrotter');

    const deserialBruce = Cereal.deserialize(serialBruce, Person) as Person;

    expect(deserialBruce).to.not.equal(serialBruce);
    expect(deserialBruce.firstName).to.equal('Bruce');
    expect(deserialBruce.lastName).to.equal('Bogtrotter');
    expect(deserialBruce.getFullName()).to.equal('Bruce Bogtrotter');
  });
});