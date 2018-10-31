import 'mocha';
import {Serialize, Cereal} from '../../';
import {expect} from 'chai';

class Person {
    @Serialize() firstName: string;
    @Serialize() lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

class Company {
    @Serialize(null, Person) employees: Person[];
}

describe('Simple Array Serialization', () => {
    const company = new Company();
    const bruce = new Person('Bruce', 'Bogtrotter');
    const barry = new Person('Barry', 'Boopdoot');

    company.employees = [bruce, barry];

    it('should serialize arrays', () => {
        const serialCompany = Cereal.serialize(company, Company);
        expect(serialCompany.employees.length).to.equal(2);
        expect(serialCompany.employees[0].firstName).to.equal('Bruce');
    });
});