import 'mocha';
import {Deserialise, Cereal} from '../../';
import {expect} from 'chai';

class Person {
    @Deserialise('first_name') firstName: string;
    @Deserialise('last_name') lastName: string;

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

describe('Renamed Property Deserialisation', () => {
    const bruce = {
        'first_name': 'Bruce',
        'last_name': 'Bogtrotter'
    };

    it('should deserialise based on given class', () => {
        const deserialBruce = Cereal.deserialise(bruce, Person) as Person;

        expect(deserialBruce.firstName).to.equal('Bruce');
        expect(deserialBruce.lastName).to.equal('Bogtrotter');
        expect(deserialBruce.getFullName()).to.equal('Bruce Bogtrotter');
    });
});