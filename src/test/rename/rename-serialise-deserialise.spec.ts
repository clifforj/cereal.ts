import 'mocha';
import {SerialiseDeserialise, Cereal} from '../../';
import {expect} from 'chai';

class Person {
    @SerialiseDeserialise('first_name') firstName: string;
    @SerialiseDeserialise('last_name') lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

describe('Renamed Property Serialisation / Deserialisation', () => {
    const bruce = new Person('Bruce', 'Bogtrotter');

    it('should serialise / deserialise based on given class', () => {
        const serialBruce = Cereal.serialise(bruce, Person);

        expect(serialBruce).to.not.equal(bruce);
        expect(serialBruce['first_name']).to.equal('Bruce');
        expect(serialBruce['last_name']).to.equal('Bogtrotter');

        const deserialBruce = Cereal.deserialise(serialBruce, Person) as Person;

        expect(deserialBruce).to.not.equal(serialBruce);
        expect(deserialBruce.firstName).to.equal('Bruce');
        expect(deserialBruce.lastName).to.equal('Bogtrotter');
        expect(deserialBruce.getFullName()).to.equal('Bruce Bogtrotter');
    });
});