import 'mocha';
import {Serialise, Cereal} from '../../';
import {expect} from 'chai';
import {ICustomSerialiser} from "../../util/custom-serialiser.interface";

class Person {
    fullName: string;

    static BeforeDeserialised(deserialisedObject: Person, originalObject: any) {
        deserialisedObject.fullName = originalObject.title;
    }

    static AfterDeserialised(deserialisedObject: Person, originalObject: any) {
        deserialisedObject.fullName += ` ${originalObject.firstName} ${originalObject.lastName}`;
    }
}

describe('Object Deserialisation With Life-cycle Hooks', () => {
    const bruce = {
      firstName: 'Bruce',
      lastName: 'Bogtrotter',
      title: 'Mr'
    };

    it('should have full name added by life-cycle hooks', () => {
        const deserialBruce = Cereal.deserialise(bruce, Person);

        expect(deserialBruce.fullName).to.equal('Mr Bruce Bogtrotter');
    });
});