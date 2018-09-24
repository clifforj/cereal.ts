import 'mocha';
import {SerialiseDeserialise, Cereal} from '../../';
import {expect} from 'chai';

class Person {
    @SerialiseDeserialise() firstName: string;
    @SerialiseDeserialise() lastName: string;
    age: number;

    constructor(firstName: string, lastName: string, age: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

describe('Simple Serialisation / Deserialisation', () => {
    const bruce = new Person('Bruce', 'Bogtrotter', 10);

    it('should serialise / deserialise based on given class', () => {
        const serialBruce = Cereal.serialise(bruce, Person);

        expect(serialBruce).to.not.equal(bruce);
        expect(serialBruce.firstName).to.equal('Bruce');
        expect(serialBruce.lastName).to.equal('Bogtrotter');
        expect(serialBruce.age).to.be.undefined;

        const deserialBruce = Cereal.deserialise(serialBruce, Person) as Person;

        expect(deserialBruce).to.not.equal(serialBruce);
        expect(deserialBruce.firstName).to.equal('Bruce');
        expect(deserialBruce.lastName).to.equal('Bogtrotter');
        expect(deserialBruce.getFullName()).to.equal('Bruce Bogtrotter');
        expect(deserialBruce.age).to.be.undefined;
    });
});