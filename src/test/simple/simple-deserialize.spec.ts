import 'mocha';

import {expect} from 'chai';

import {Cereal, Deserialize} from '../../';

class Person {
  @Deserialize() firstName: string;
  @Deserialize() lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

describe('Simple Deserialization', () => {
  const bruce = new Person('Bruce', 'Bogtrotter');

  it('should deserialize based on given class', () => {
    const deserialBruce = Cereal.deserialize(bruce, Person) as Person;

    expect(deserialBruce).to.not.equal(bruce);
    expect(deserialBruce.firstName).to.equal('Bruce');
    expect(deserialBruce.lastName).to.equal('Bogtrotter');
    expect(deserialBruce.getFullName()).to.equal('Bruce Bogtrotter');
  });

  it('should just return passed object when no target given', () => {
    const deserialBruce = Cereal.deserialize(bruce);

    expect(deserialBruce).to.equal(bruce);
  });
});