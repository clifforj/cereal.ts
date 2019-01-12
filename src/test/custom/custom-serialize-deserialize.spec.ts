import 'mocha';

import {expect} from 'chai';

import {Cereal, Serialize, SerializeDeserialize} from '../../';
import {ICustomSerializer} from '../../util/custom-serializer.interface';

class StringToNumberSerializer implements ICustomSerializer {
  deserialize(object: number) {
    if (object || object === 0) {
      return object.toFixed(0);
    } else {
      return undefined;
    }
  }

  serialize(jsonObject: string): number {
    if (jsonObject) {
      return +jsonObject;
    } else {
      return undefined;
    }
  }
}
const stringToNumberSerializer = new StringToNumberSerializer();

class Person {
  @SerializeDeserialize() name: string;
  @SerializeDeserialize(null, stringToNumberSerializer) age: string;

  constructor(name: string, age: string) {
    this.name = name;
    this.age = age;
  }
}

describe(
    'Object Serialization / Deserialization With Custom Serializer', () => {
      const bruce = new Person('bruce', '10');

      it('should serialize age with custom serializer', () => {
        const serialBruce = Cereal.serialize(bruce, Person);

        expect(serialBruce).to.not.equal(bruce);
        expect(serialBruce.age).to.equal(10);

        const deserialBruce = Cereal.deserialize(serialBruce, Person);

        expect(serialBruce).to.not.equal(deserialBruce);
        expect(deserialBruce.age).to.equal('10');
      });
    });