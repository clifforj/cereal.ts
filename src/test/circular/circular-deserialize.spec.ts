import 'mocha';
import {Cereal, Deserialize} from '../../';
import {expect} from 'chai';

class Person {
    @Deserialize() firstName: string;
    @Deserialize() lastName: string;
    @Deserialize(null, Person) manager: Person;
}

class Company {
    @Deserialize(null, Person) employees: Person[];
}

describe('Circular Reference Deserialization', () => {

    const company = {
        '@id': 1,
        employees: [
            {
                '@id': 2,
                firstName: 'A',
                lastName: 'Aa',
                manager: {
                    '@id': 3,
                    firstName: 'B',
                    lastName: 'Bb',
                    manager: 2
                }
            },
            3,
            {
                '@id': 4,
                firstName: 'C',
                lastName: 'Cc',
                manager: null
            },
            {
                '@id': 5,
                firstName: 'D',
                lastName: 'Dd',
                manager: 4
            }
        ]
    };

    it('should deserialize circular references', () => {
        Cereal.resetDeserializationIdMap();
        const deserialCompany = Cereal.deserialize(company, Company);

        expect(deserialCompany.employees.length).to.equal(4);
        expect(deserialCompany.employees[0].firstName).to.equal('A');
        expect(deserialCompany.employees[0].manager.firstName).to.equal('B');
        expect(deserialCompany.employees[0].manager.manager).to.equal(deserialCompany.employees[0]); // Circular reference back to A

        expect(deserialCompany.employees[1].firstName).to.equal('B');
        expect(deserialCompany.employees[1].manager.firstName).to.equal('A');
        expect(deserialCompany.employees[1].manager).to.equal(deserialCompany.employees[0]);
        expect(deserialCompany.employees[1].manager.manager).to.equal(deserialCompany.employees[1]); // Circular reference back to B

        expect(deserialCompany.employees[2].firstName).to.equal('C');

        expect(deserialCompany.employees[3].firstName).to.equal('D');
        expect(deserialCompany.employees[3].manager).to.equal(deserialCompany.employees[2]);
    });
});