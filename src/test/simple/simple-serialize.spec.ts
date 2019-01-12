import 'mocha';

import {expect} from 'chai';

import {Cereal, Serialize} from '../../';

class Person {
  @Serialize() firstName: string;
  @Serialize() lastName: string;
  age: number;

  constructor(firstName: string, lastName: string, age: number) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }
}

describe('Simple Serialization', () => {
  const bruce = new Person('Bruce', 'Bogtrotter', 10);

  it('should serialize based on given class', () => {
    const serialBruce = Cereal.serialize(bruce, Person);

    expect(serialBruce).to.not.equal(bruce);
    expect(serialBruce.firstName).to.equal('Bruce');
    expect(serialBruce.lastName).to.equal('Bogtrotter');
    // tslint:disable-next-line:no-unused-expression
    expect(serialBruce.age).to.be.undefined;
  });

  it('should just return passed object when no target given', () => {
    const serialBruce = Cereal.serialize(bruce);

    expect(serialBruce).to.equal(bruce);
  });
});