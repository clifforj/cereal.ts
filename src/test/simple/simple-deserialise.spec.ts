import 'mocha';
import {Deserialise, Cereal} from '../../';
import {expect} from 'chai';

class Person {
    @Deserialise() firstName: string;
    @Deserialise() lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

describe('Simple Deserialisation', () => {
    const bruce = new Person('Bruce', 'Bogtrotter');

    it('should deserialise based on given class', () => {
        const deserialBruce = Cereal.deserialise(bruce, Person) as Person;

        expect(deserialBruce).to.not.equal(bruce);
        expect(deserialBruce.firstName).to.equal('Bruce');
        expect(deserialBruce.lastName).to.equal('Bogtrotter');
        expect(deserialBruce.getFullName()).to.equal('Bruce Bogtrotter');
    });

    it('should just return passed object when no target given', () => {
        const deserialBruce = Cereal.deserialise(bruce);

        expect(deserialBruce).to.equal(bruce);
    });
});