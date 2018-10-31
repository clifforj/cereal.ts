import 'mocha';
import {Serialize, Cereal, Deserialize} from '../../';
import {expect} from 'chai';

class Person {
    @Deserialize() firstName: string;
    @Deserialize() lastName: string;

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}

class Company {
    @Deserialize(null, Person) employees: Person[];
}

describe('Simple Array Deserialization', () => {
    const company = {
        employees: [
            {
                firstName: 'Bruce',
                lastName: 'Bogtrotter'
            },
            {
                firstName: 'Barry',
                lastName: 'Boopdoot'
            }
        ]
    };

    it('should deserialize arrays', () => {
        const deserialCompany = Cereal.deserialize(company, Company);
        expect(deserialCompany.employees.length).to.equal(2);
        expect(deserialCompany.employees[0].getFullName()).to.equal('Bruce Bogtrotter');
        expect(deserialCompany.employees[1].getFullName()).to.equal('Barry Boopdoot');
    });
});