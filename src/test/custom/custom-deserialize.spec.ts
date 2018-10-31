import 'mocha';
import {Cereal, Deserialize} from '../../';
import {expect} from 'chai';
import {ICustomSerializer} from "../../util/custom-serializer.interface";

class StringToNumberSerializer implements ICustomSerializer {
    deserialize(object: number) {
        if (object || object === 0) {
            return object.toFixed(0);
        } else {
            return undefined;
        }
    }

    serialize(): number {
        return undefined;
    }
}
const stringToNumberSerializer = new StringToNumberSerializer();

class Person {
    @Deserialize() name: string;
    @Deserialize(null, stringToNumberSerializer) age: string;

    constructor(name: string, age: string) {
        this.name = name;
        this.age = age;
    }
}

describe('Object Deserialization With Custom Serializer', () => {
    const bruce = {
        name: 'Bruce',
        age: 10
    };

    it('should deserialize age with custom serializer', () => {
        const deserialBruce = Cereal.deserialize(bruce, Person);

        expect(deserialBruce).to.not.equal(bruce);
        expect(deserialBruce.age).to.equal('10');
    });
});