import 'mocha';

import {expect} from 'chai';

import {Cereal, Serialize} from '../../';

class Name {
  @Serialize('first_name') firstName: string;
  @Serialize('last_name') lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

class Pet {
  @Serialize(null, Name) name: Name;
  colour: string;

  constructor(name: Name, colour: string) {
    this.name = name;
    this.colour = colour;
  }
}

class Person {
  @Serialize(null, Name) name: Name;
  @Serialize(null, Pet) pet: Pet;

  constructor(name: Name, pet: Pet) {
    this.name = name;
    this.pet = pet;
  }
}

describe('Nested Object Serialization', () => {
  const bruceName = new Name('Bruce', 'Bogtrotter');
  const percyName = new Name('Percy', 'Paws');

  const percy = new Pet(percyName, 'brown');
  const bruce = new Person(bruceName, percy);

  it('should serialize structure based on applied classes', () => {
    const serialBruce = Cereal.serialize(bruce, Person);

    expect(serialBruce).to.not.equal(bruce);
    expect(serialBruce.name).to.not.equal(bruceName);
    expect(serialBruce.pet).to.not.equal(percy);
    expect(serialBruce.pet.name).to.not.equal(percyName);
    expect(serialBruce.name['first_name']).to.equal('Bruce');
    expect(serialBruce.name['last_name']).to.equal('Bogtrotter');
    expect(serialBruce.pet.name['first_name']).to.equal('Percy');
    expect(serialBruce.pet.name['last_name']).to.equal('Paws');
  });
});