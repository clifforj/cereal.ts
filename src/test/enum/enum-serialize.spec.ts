import 'mocha';
import {Serialize, Cereal} from '../../';
import {expect} from 'chai';
import {Constructor} from "../../util/constructor";

enum FlavorEnum {
    BANANA
}

enum FlavorTextEnum {
    CHOCOLATE = 'Chocolate'
}

class Cake {
    @Serialize() flavor: FlavorEnum;
}

class CakeAlt {
    @Serialize() flavor: FlavorTextEnum;
}

describe('Enum Serialization', () => {
    it('should serialize enums on given class', () => {
        const cake = new Cake();
        cake.flavor = FlavorEnum.BANANA;

        const cakeSerial = Cereal.serialize(cake, Cake);
        expect(cakeSerial.flavor).to.equal(0);

        const cakeAlt = new CakeAlt();
        cakeAlt.flavor = FlavorTextEnum.CHOCOLATE;

        const cakeAltSerial = Cereal.serialize(cakeAlt, CakeAlt);
        expect(cakeAltSerial.flavor).to.equal('Chocolate');
    });
});