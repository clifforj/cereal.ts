import 'mocha';
import {Serialize, Cereal} from '../../';
import {expect} from 'chai';

class Person {
    @Serialize('first_name') firstName: string;
    @Serialize('last_name') lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

describe('Renamed Property Serialization', () => {
    const bruce = new Person('Bruce', 'Bogtrotter');

    it('should serialize based on given class', () => {
        const serialBruce = Cereal.serialize(bruce, Person);

        expect(serialBruce).to.not.equal(bruce);
        expect(serialBruce['first_name']).to.equal('Bruce');
        expect(serialBruce['last_name']).to.equal('Bogtrotter');
    });
});