import 'mocha';
import {Serialise, Cereal} from '../../';
import {expect} from 'chai';

class Person {
    @Serialise() firstName: string;
    @Serialise() lastName: string;
    age: number;

    constructor(firstName: string, lastName: string, age: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }
}

describe('Simple Serialisation', () => {
    const bruce = new Person('Bruce', 'Bogtrotter', 10);

    it('should serialise based on given class', () => {
        const serialBruce = Cereal.serialise(bruce, Person);

        expect(serialBruce).to.not.equal(bruce);
        expect(serialBruce.firstName).to.equal('Bruce');
        expect(serialBruce.lastName).to.equal('Bogtrotter');
        expect(serialBruce.age).to.be.undefined;
    });

    it('should just return passed object when no target given', () => {
        const serialBruce = Cereal.serialise(bruce);

        expect(serialBruce).to.equal(bruce);
    });
});