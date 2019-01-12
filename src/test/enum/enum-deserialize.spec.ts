import 'mocha';

import {expect} from 'chai';

import {Cereal, Deserialize} from '../../';

enum FlavorEnum {
  BANANA
}

enum FlavorTextEnum {
  CHOCOLATE = 'Chocolate'
}

class Cake {
  @Deserialize() flavor: FlavorEnum;
}

class CakeAlt {
  @Deserialize() flavor: FlavorTextEnum;
}

describe('Enum Deserialization', () => {
  it('should deserialize enums on given class', () => {
    const cake = {flavor: 0};

    const cakeSerial = Cereal.deserialize(cake, Cake);
    expect(cakeSerial.flavor).to.equal(FlavorEnum.BANANA);

    const cakeAlt = {flavor: 'Chocolate'};

    const cakeAltSerial = Cereal.deserialize(cakeAlt, CakeAlt);
    expect(cakeAltSerial.flavor).to.equal(FlavorTextEnum.CHOCOLATE);
  });
});