import {Constructor} from '../util/constructor';
import {CustomSerialiser} from '../util/custom-serialiser';
import {SerialisationMetaStore} from "../meta/serialisation-meta-store";

/**
 * SerialisationService
 *
 * Exposed as 'Cereal'. Provides functions that serialise/deserialise objects based on information from its meta store.
 */
export class SerialisationService {
    metaStore: SerialisationMetaStore = new SerialisationMetaStore();

    /**
     * Type guard for CustomSerialisers
     *
     * @param {object} target
     * @returns {type is CustomSerialiser} - whether the passed value has methods for custom serialisation
     */
    static isCustomSerialiser(target: object): target is CustomSerialiser {
        return 'serialise' in target || 'deserialise' in target;
    }

    /**
     * Serialise an object with the provided target. Valid targets are classes and custom serialisers. If no
     * target is specified, this method will simply return what it was given.
     *
     * @param object - the value you wish to serialise
     * @param {Constructor<any> | CustomSerialiser} target - the target for serialisation
     * @returns {any} - a serialised object based on target
     */
    // tslint:disable-next-line:no-any
    serialise(object: any, target?: Constructor<any> | CustomSerialiser) {
        // tslint:disable-next-line:no-any
        let serialisedObject: any = {};

        // Targeting a Class
        if (target && !SerialisationService.isCustomSerialiser(target)) {
            const classMeta = this.metaStore.getClass(target);

            classMeta.properties.forEach((propMeta) => {
                const serialisationMeta = propMeta.getSerialisationMeta();

                // If an override property name is specified, use it. Otherwise use the default.
                const serialisedPropertyName =
                    serialisationMeta.propertyNameOverride || propMeta.propertyName;

                // Serialise the objects property according to its meta
                serialisedObject[serialisedPropertyName] = this.serialise(
                    object[propMeta.propertyName], serialisationMeta.target);
            });

        // Targeting a CustomSerialiser
        } else if (target && SerialisationService.isCustomSerialiser(target)) {
            serialisedObject = target.serialise(object);

        // No target, return object value provided
        } else {
            serialisedObject = object;
        }

        return serialisedObject;
    }

    /**
     * Deserialise an object with the provided target. Valid targets are classes and custom serialisers. If no
     * target is specified, this method will simply return what it was given.
     *
     * @param object - the json you wish to deserialise
     * @param {Constructor<any> | CustomSerialiser} target - The target for deserialisation
     * @returns {any} - a deserialised object based on target
     */
    // tslint:disable-next-line:no-any
    deserialise(object: any, target?: Constructor<any> | CustomSerialiser) {
        // tslint:disable-next-line:no-any
        let deserialisedObject: any;

        // Targeting a Class
        if (target && !SerialisationService.isCustomSerialiser(target)) {
            // tslint:disable-next-line:no-any
            target = target as Constructor<any>;
            const classMeta = this.metaStore.getClass(target);

            deserialisedObject = new target();
            classMeta.properties.forEach((propMeta) => {
                const deserialisationMeta = propMeta.getDeserialisationMeta();

                // If an override property name is specified, use it. Otherwise use the default.
                const deserialisedPropertyName =
                    deserialisationMeta.propertyNameOverride || propMeta.propertyName;

                // Deserialise the objects property according to its meta
                deserialisedObject[propMeta.propertyName] = this.deserialise(
                    object[deserialisedPropertyName], deserialisationMeta.target);
            });

        // Targeting a CustomSerialiser
        } else if (target && SerialisationService.isCustomSerialiser(target)) {
            deserialisedObject = target.deserialise(object);

        // No target, return object value provided
        } else {
            deserialisedObject = object;
        }

        return deserialisedObject;
    }

    /**
     * Serialize an object with the provided target. Valid targets are classes and custom serializers. If no
     * target is specified, this method will simply return what it was given. (Alternate method name)
     *
     * @param object - the value you wish to serialize
     * @param {Constructor<any> | CustomSerialiser} target - the target for serialization
     * @returns {any} - a serialized object based on target
     */
    // tslint:disable-next-line:no-any
    serialize(object: any, target?: Constructor<any> | CustomSerialiser) { return this.serialise(object, target) }

    /**
     * Deserialize an object with the provided target. Valid targets are classes and custom serializers. If no
     * target is specified, this method will simply return what it was given. (Alternate method name)
     *
     * @param object - the json you wish to deserialize
     * @param {Constructor<any> | CustomSerialiser} target - The target for deserialization
     * @returns {any} - a deserialized object based on target
     */
    // tslint:disable-next-line:no-any
    deserialize(object: any, target?: Constructor<any> | CustomSerialiser) { return this.deserialise(object, target) }
}