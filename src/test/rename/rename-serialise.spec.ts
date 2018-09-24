import 'mocha';
import {Serialise, Cereal} from '../../';
import {expect} from 'chai';

class Person {
    @Serialise('first_name') firstName: string;
    @Serialise('last_name') lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

describe('Renamed Property Serialisation', () => {
    const bruce = new Person('Bruce', 'Bogtrotter');

    it('should serialise based on given class', () => {
        const serialBruce = Cereal.serialise(bruce, Person);

        expect(serialBruce).to.not.equal(bruce);
        expect(serialBruce['first_name']).to.equal('Bruce');
        expect(serialBruce['last_name']).to.equal('Bogtrotter');
    });
});