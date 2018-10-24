import 'mocha';
import {Cereal, Deserialise} from '../../';
import {expect} from 'chai';
import {ICustomSerialiser} from "../../util/custom-serialiser.interface";

class StringToNumberSerialiser implements ICustomSerialiser {
    deserialise(object: number) {
        if (object || object === 0) {
            return object.toFixed(0);
        } else {
            return undefined;
        }
    }

    serialise(): number {
        return undefined;
    }
}
const stringToNumberSerialiser = new StringToNumberSerialiser();

class Person {
    @Deserialise() name: string;
    @Deserialise(null, stringToNumberSerialiser) age: string;

    constructor(name: string, age: string) {
        this.name = name;
        this.age = age;
    }
}

describe('Object Deserialisation With Custom Serialiser', () => {
    const bruce = {
        name: 'Bruce',
        age: 10
    };

    it('should deserialise age with custom serialiser', () => {
        const deserialBruce = Cereal.deserialise(bruce, Person);

        expect(deserialBruce).to.not.equal(bruce);
        expect(deserialBruce.age).to.equal('10');
    });
});