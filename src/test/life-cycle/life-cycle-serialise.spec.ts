import 'mocha';
import {Serialise, Cereal} from '../../';
import {expect} from 'chai';
import {ICustomSerialiser} from "../../util/custom-serialiser.interface";

class Person {
    @Serialise() firstName: string;
    @Serialise() lastName: string;
    title: string;

    static BeforeSerialised(serialisedObject: any, originalObject: Person) {
        serialisedObject.fullName = originalObject.title;
    }

    static AfterSerialised(serialisedObject: any, originalObject: Person) {
        serialisedObject.fullName += ` ${serialisedObject.firstName} ${serialisedObject.lastName}`;
    }

    constructor(firstName: string, lastName: string, title: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.title = title;
    }
}

describe('Object Serialisation With Life-cycle Hooks', () => {
    const bruce = new Person('Bruce', 'Bogtrotter', 'Mr');

    it('should have full name added by life-cycle hooks', () => {
        const serialBruce = Cereal.serialise(bruce, Person);

        expect(serialBruce.fullName).to.equal('Mr Bruce Bogtrotter');
    });
});