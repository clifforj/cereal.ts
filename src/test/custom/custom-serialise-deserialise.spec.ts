import 'mocha';
import {Serialise, Cereal, SerialiseDeserialise} from '../../';
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

    serialise(jsonObject: string): number {
        if (jsonObject) {
            return parseInt(jsonObject);
        } else {
            return undefined;
        }
    }
}
const stringToNumberSerialiser = new StringToNumberSerialiser();

class Person {
    @SerialiseDeserialise() name: string;
    @SerialiseDeserialise(null, stringToNumberSerialiser) age: string;

    constructor(name: string, age: string) {
        this.name = name;
        this.age = age;
    }
}

describe('Object Serialisation / Deserialisation With Custom Serialiser', () => {
    const bruce = new Person('bruce', '10');

    it('should serialise age with custom serialiser', () => {
        const serialBruce = Cereal.serialise(bruce, Person);

        expect(serialBruce).to.not.equal(bruce);
        expect(serialBruce.age).to.equal(10);

        const deserialBruce = Cereal.deserialise(serialBruce, Person);

        expect(serialBruce).to.not.equal(deserialBruce);
        expect(deserialBruce.age).to.equal('10');
    });
});