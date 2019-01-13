# Cereal.ts [![Coverage Status](https://coveralls.io/repos/github/clifforj/cereal.ts/badge.svg?branch=master)](https://coveralls.io/github/clifforj/cereal.ts?branch=master) [![Build Status](https://travis-ci.com/clifforj/cereal.ts.svg?branch=master)](https://travis-ci.com/clifforj/cereal.ts/)

![What is this](cereal.jpg)

A simple annotation based serialization approach for TypeScript. Supports property renaming, custom serializers, 
circular references and lifecycle hooks.

## Getting Started

```
npm install cereal.ts
```

Once added to your project, it's time to start annotating your classes! 

## Serializing / Deserializing

To serialize an instance of an annotated class simply supply the object and the class. The following will return you a 
JSON object that follows your annotations *(it serializes recursively, so any nested objects will be serialized too)*:

```
Cereal.serialize(instance, MyClass);
```

To take a JSON object and use a class to deserialize it based on your annotations, use the following. This will return
you an instance of the supplied class populated with the values from your JSON *(it deserializes recursively, so any 
nested objects will be deserialized too)*:

```
Cereal.deserialize(json, MyClass);
```

## Annotations

Serialization meta data is added to classes with annotations. There are a bunch of different things that you can 
configure with these annotations, giving you a great deal of flexibility around how your objects are processed. The 
tests in this project contain a lot of usage examples, but an explanation of the annotations is below.

#### Simple inclusion of properties (primitive types)

You are in full control of which properties your serialized object contains, and which values you read off a JSON 
object. Using the following annotations you can control whether each property is serialized or deserialized, or both!

```
class Person {
    @Serialize() title: string; // serialized only
    @Deserialize() age: number; // deserialized only
    
    @SerializeDeserialize() firstName: string; // serialized and deserialized
    @SerializeDeserialize() lastName: string; // serialized and deserialized
    
    middleName: string; // never serialized, never deserialized
}
```

#### Renaming properties / mapping properties (primitive types)

In situations where the names of your properties differ from what you need in your serialized objects, or if you need
to map a value from a different property on a JSON object, you can simply supply the alternate name to the annotation.

```
class Person {
    @Serialize('turtle') title: string; // serialized object will have a 'turtle' property with the value from 'title'
    @Deserialize('only_a_number') age: number; // deserialization will read from 'only_a_number' and assign to 'age'
    
    @SerializeDeserialize('first_name') firstName: string; // serialized to 'first_name' and deserialized from the same
    @SerializeDeserialize('last_name') lastName: string; // serialized to 'last_name' and deserialized from the same
    
    middleName: string; // never serialized, never deserialized
}
```

#### Properties with complex types

If your property doesn't have a primitive type, you can serialize/deserialize it as follows.

```
class Dog {
    /*
        Any object assigned to this property will be serialized based on the annotations associated with the 
        'Person' class. If an instance of 'Dog' is deserialized, it's owner value will become an instance of 'Person'.
    */
    @SerializeDeserialize(null, Person) owner: Person; 
    
    // Other dog related things
}
```

`null` has been passed as the first parameter here, this is because we did not wish to rename the property. Had we 
written the annotation as `@SerializeDeserialize('bestFriend', Person)` then the renaming behaviour would take place 
as expected, and a serialized `Dog` would have a `bestFriend` property.

#### Arrays

If the value of the property you are serializing or deserializing is an array, each element in the array will be handled
as per the property annotation.

```
class Company {
    @SerializeDeserialize(null, Person) employees: Person[]; 
}
```

#### Enums

Enums are dealt with in the same way as primitives. The value associated with the enum is what will end up being 
serialized/deserialized. For example:

```
enum SpongeFlavor {
    VANILLA, // 0
    CHOCOLATE // 1
}

enum IcingFlavor {
    VANILLA = 'Vanilla',
    CHOCOLATE = 'Chocolate'
}

class Cake {
    /*
        Serialized property value will be either 0 or 1, will deserialize into the correct enum from 0 or 1
    */
    @SerializeDeserialize() spongeFlavor: SpongeFlavor; 
    
    /*
        Serialized property value will be either 'Vanilla' or 'Chocolate', will deserialize into the correct
        enum from 'Vanilla' or 'Chocolate'
    */
    @SerializeDeserialize() IcingFlavor: IcingFlavor;
}
```

#### Custom serialization

If you need something special to happen when a property is serialized/deserialized, you can create a custom serializer. 
A custom serializer implements `ICustomSerializer` by adding one or both of `serialize` and `deserialize` functions. You
might use this to ensure dates are correctly formatted between systems, or if you have a number of subclasses you wish 
to use for a property.

```
class EveryStringIsPotatoSerializer implements ICustomSerializer {
    // The object passed here, is the value that needs to be serialized.
    serialize(object: string): number {
    
        // the return value of this function is what will be assigned to the property on the serialized object
        return 'potato';
    }
    
    // The jsonObject passed here, is the value that needs to be deserialized.
    deserialize(jsonObject: string): number {
    
        // the return value of this function is what will be assigned to the property on the deserialized object
        return 'potato';
    }
}
export const everyStringIsPotatoSerializer = new EveryStringIsPotatoSerializer();

class Person {
    /*
        No matter what value this property is set to, the serialized object will always contain 'name: "potato"'.
        No matter what value is present on a JSON object you are deserializing, the value will be set to 'potato'.
    */
    @SerializeDeserialize(null, everyStringIsPotatoSerializer) name: string;
}
```

#### Lifecycle events

Sometimes you'll want to do things within an object before it gets serialized/deserialized (like reordering arrays). 
There are 4 lifecycle events to let you do exactly that. You can hook into these events by creating static functions on
your classes. These are then supplied the objects involved in the event.

```
class Person {
    /* ...person properties */
     
    /*
        Called before an object is serialized. 'serializedObject' is the empty object that the 'originalObject' will 
        be serialized into. 'originalObject' is the object being serialized.
    */
    static BeforeSerialized(serializedObject: any, originalObject: Person) {}
    
    // Called after the object is serialized. 'serializedObject' is the serialized version of 'originalObject'.
    static AfterSerialized(serializedObject: any, originalObject: Person) {}
    
    /*
        Called before an object is deserialized. 'deserializedObject' is a new instance of the class that 
        'originalObject' will be deserialized into. 'originalObject' is the json object being deserialized.
    */
    static BeforeDeserialized(deserializedObject: Person, originalObject: any) {}
    
    // Called after the object is deserialized. 'deserializedObject' is the deserialized version of 'originalObject'.
    static AfterDeserialized(deserializedObject: Person, originalObject: any) {}
}
```

... There isn't currently an interface to implement for this. TypeScript interfaces can't contain static members (so far
as I can tell)

#### Circular references

The default approach is to automatically break circular references and replace repeat instances of an object with an ID 
that can be mapped back to it's first instance. It's probably easier to understand through example JSON. In this example 
we will be using a `Person` object that has a `bestFriend` property of another `Person`.

```
{
    "@id": 1,
    "firstName": "Ben",
    "bestFriend": {
        "@id": 2
        "firstName": "Jerry",
        "bestFriend": 1
    }
}
```

`Ben` is best friends with `Jerry`, and `Jerry` is best friends with `Ben`. If we tried to serialize this without 
breaking the circular references, we'd fail. So instead of printing out `Ben` again, we replace it with it's `@id`, `1`. 
`@id` is generated by the serialization process and attached to the serialized object.

A map of ID's and serialized instances is stored by `cereal.ts` to ensure smooth circular reference smashing. You would 
typically want to reset this cache each time you serialize a complex object chain (or per request)
using `Cereal.resetSerializationIdMap()` and its counterpart `Cereal.resetDeserializationIdMap()`

When a JSON object is received with the above format, `cereal.ts` will rebuild the references it finds and set the 
expected values on the properties. i.e. There will be two `Person` objects, one for `Ben` one for `Jerry`, and both will
have each other set as their `bestFriend`.

You can turn off this circular reference behaviour by setting `Cereal.supportCircularReferences = false`. You can also 
set the name of the property used to hold the serialization ID to something other than `@id` like this 
`Cereal.idProperty = '$uid'`.

This circular reference functionality is compatible with the way that Jackson (Java JSON library) behaves, just ensure 
that the ID property name is set correctly.

## Working on the library

If you want to do some work on the library, here's some info to get started.
 

#### Running the tests

Tests are in the src/test folder, built with Mocha/Chai.

```
npm test
```

#### Compiling

To compile the TypeScript into the build folder

```
npm run compile
```

#### Clean up and code styles

Code styling is handled with `gts` [(Google TypeScript Style)](https://github.com/google/ts-style). The commands used are below.

```
npm run check
npm run clean
npm run fix
```

`npm run fix` should be ran before raising any pull requests.

## Authors

* **John Clifford** - [clifforj](https://github.com/clifforj)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Inspired by [Cerialize](https://github.com/weichx/cerialize/)
