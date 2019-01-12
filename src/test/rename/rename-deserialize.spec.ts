import 'mocha';

import {expect} from 'chai';

import {Cereal, Deserialize} from '../../';

class Person {
  @Deserialize('first_name') firstName: string;
  @Deserialize('last_name') lastName: string;

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

describe('Renamed Property Deserialization', () => {
  const bruce = {'first_name': 'Bruce', 'last_name': 'Bogtrotter'};

  it('should deserialize based on given class', () => {
    const deserialBruce = Cereal.deserialize(bruce, Person) as Person;

    expect(deserialBruce.firstName).to.equal('Bruce');
    expect(deserialBruce.lastName).to.equal('Bogtrotter');
    expect(deserialBruce.getFullName()).to.equal('Bruce Bogtrotter');
  });
});