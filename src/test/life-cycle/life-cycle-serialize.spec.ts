import 'mocha';
import {Serialize, Cereal} from '../../';
import {expect} from 'chai';
import {ICustomSerializer} from "../../util/custom-serializer.interface";

class Person {
    @Serialize() firstName: string;
    @Serialize() lastName: string;
    title: string;

    static BeforeSerialized(serializedObject: any, originalObject: Person) {
        serializedObject.fullName = originalObject.title;
    }

    static AfterSerialized(serializedObject: any, originalObject: Person) {
        serializedObject.fullName += ` ${serializedObject.firstName} ${serializedObject.lastName}`;
    }

    constructor(firstName: string, lastName: string, title: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.title = title;
    }
}

describe('Object Serialization With Life-cycle Hooks', () => {
    const bruce = new Person('Bruce', 'Bogtrotter', 'Mr');

    it('should have full name added by life-cycle hooks', () => {
        const serialBruce = Cereal.serialize(bruce, Person);

        expect(serialBruce.fullName).to.equal('Mr Bruce Bogtrotter');
    });
});