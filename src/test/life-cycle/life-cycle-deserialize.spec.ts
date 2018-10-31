import 'mocha';
import {Serialize, Cereal} from '../../';
import {expect} from 'chai';
import {ICustomSerializer} from "../../util/custom-serializer.interface";

class Person {
    fullName: string;

    static BeforeDeserialized(deserializedObject: Person, originalObject: any) {
        deserializedObject.fullName = originalObject.title;
    }

    static AfterDeserialized(deserializedObject: Person, originalObject: any) {
        deserializedObject.fullName += ` ${originalObject.firstName} ${originalObject.lastName}`;
    }
}

describe('Object Deserialization With Life-cycle Hooks', () => {
    const bruce = {
      firstName: 'Bruce',
      lastName: 'Bogtrotter',
      title: 'Mr'
    };

    it('should have full name added by life-cycle hooks', () => {
        const deserialBruce = Cereal.deserialize(bruce, Person);

        expect(deserialBruce.fullName).to.equal('Mr Bruce Bogtrotter');
    });
});