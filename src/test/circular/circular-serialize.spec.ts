import 'mocha';

import {expect} from 'chai';

import {Cereal, Serialize} from '../../';

class Person {
  @Serialize() firstName: string;
  @Serialize() lastName: string;
  @Serialize(null, Person) manager: Person;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

class Company {
  @Serialize(null, Person) employees: Person[];
}

describe('Circular Reference Serialization', () => {
  const company = new Company();

  const A = new Person('A', 'Aa');  // Expect to be object in employee array
  const B = new Person('B', 'Bb');  // Expect to be an ID in employee array
  const C = new Person('C', 'Cc');  // Expect to be an ID in employee array
  A.manager = B;                    // Expect to be object against property
  B.manager = C;                    // Expect to be object against property
  C.manager = A;  // Expect to be an ID against property (circular)

  const D = new Person('D', 'Dd');  // Expect to be object in employee array
  const E = new Person('E', 'Ee');  // Expect to be object in employee array
  E.manager = D;                    // Expect to be an ID against property

  const F = new Person('F', 'Ff');  // Expect to be object in employee array

  company.employees = [A, B, C, D, E, F];

  it('should serialize circular references', () => {
    Cereal.resetSerializationIdMap();
    const serialCompany = Cereal.serialize(company, Company);

    expect(serialCompany.employees.length).to.equal(6);

    expect(serialCompany[Cereal.idProperty]).to.equal(1);

    expect(serialCompany.employees[0][Cereal.idProperty]).to.equal(2);
    expect(serialCompany.employees[0].firstName).to.equal('A');

    expect(serialCompany.employees[0].manager[Cereal.idProperty]).to.equal(3);
    expect(serialCompany.employees[0].manager.firstName).to.equal('B');
    expect(serialCompany.employees[1]).to.equal(3);

    expect(serialCompany.employees[0].manager.manager[Cereal.idProperty])
        .to.equal(4);
    expect(serialCompany.employees[0].manager.manager.firstName).to.equal('C');
    expect(serialCompany.employees[0].manager.manager.manager)
        .to.equal(2);  // circular reference to A
    expect(serialCompany.employees[2]).to.equal(4);

    expect(serialCompany.employees[3][Cereal.idProperty]).to.equal(5);
    expect(serialCompany.employees[3].firstName).to.equal('D');

    expect(serialCompany.employees[4][Cereal.idProperty]).to.equal(6);
    expect(serialCompany.employees[4].firstName).to.equal('E');
    expect(serialCompany.employees[4].manager).to.equal(5);

    expect(serialCompany.employees[5][Cereal.idProperty]).to.equal(7);
    expect(serialCompany.employees[5].firstName).to.equal('F');
  });
});