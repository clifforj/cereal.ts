import 'mocha';

import {expect} from 'chai';

import {Cereal, Serialize} from '../../';
import {ICustomSerializer} from '../../util/custom-serializer.interface';

class StringToNumberSerializer implements ICustomSerializer {
  serialize(object: string): number {
    if (object) {
      return +object;
    } else {
      return undefined;
    }
  }
}
const stringToNumberSerializer = new StringToNumberSerializer();

class Person {
  @Serialize() name: string;
  @Serialize(null, stringToNumberSerializer) age: string;

  constructor(name: string, age: string) {
    this.name = name;
    this.age = age;
  }
}

describe('Object Serialization With Custom Serializer', () => {
  const bruce = new Person('bruce', '10');

  it('should serialize age with custom serializer', () => {
    const serialBruce = Cereal.serialize(bruce, Person);

    expect(serialBruce).to.not.equal(bruce);
    expect(serialBruce.age).to.equal(10);
  });
});