import {Constructor} from '../util/constructor';
import {ICustomSerialiser} from '../util/custom-serialiser.interface';
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
     * @returns {type is ICustomSerialiser} - whether the passed value has methods for custom serialisation
     */
    static isCustomSerialiser(target: object): target is ICustomSerialiser {
        return 'serialise' in target || 'deserialise' in target;
    }

    // tslint:disable-next-line:no-any
    static callLifeCycleHook(processedObject: any, originalObject: any, target: any, wasSerialised: boolean, isAfterHook: boolean) {
        if (isAfterHook) {
            if (wasSerialised) {
                if (target.AfterSerialised || target.AfterSerialized) {
                    if (target.AfterSerialised) {
                        target.AfterSerialised(processedObject, originalObject);
                    } else {
                        target.AfterSerialized(processedObject, originalObject);
                    }
                }
            } else {
                if (target.AfterDeserialised || target.AfterDeserialized) {
                    if (target.AfterDeserialised) {
                        target.AfterDeserialised(processedObject, originalObject);
                    } else {
                        target.AfterDeserialized(processedObject, originalObject);
                    }
                }
            }
        } else {
            if (wasSerialised) {
                if (target.BeforeSerialised || target.BeforeSerialized) {
                    if (target.BeforeSerialised) {
                        target.BeforeSerialised(processedObject, originalObject);
                    } else {
                        target.BeforeSerialized(processedObject, originalObject);
                    }
                }
            } else {
                if (target.BeforeDeserialised || target.BeforeDeserialized) {
                    if (target.BeforeDeserialised) {
                        target.BeforeDeserialised(processedObject, originalObject);
                    } else {
                        target.BeforeDeserialized(processedObject, originalObject);
                    }
                }
            }
        }
    }

    /**
     * Serialise an object with the provided target. Valid targets are classes and custom serialisers. If no
     * target is specified, this method will simply return what it was given.
     *
     * @param object - the value you wish to serialise
     * @param {Constructor<any> | ICustomSerialiser} target - the target for serialisation
     * @returns {any} - a serialised object based on target
     */
    // tslint:disable-next-line:no-any
    serialise(object: any, target?: Constructor<any> | ICustomSerialiser) {
        // tslint:disable-next-line:no-any
        let serialisedObject: any;

        // Targeting a Class
        if (target && !SerialisationService.isCustomSerialiser(target)) {
            serialisedObject = {};
            SerialisationService.callLifeCycleHook(serialisedObject, object, target, true, false);
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

            SerialisationService.callLifeCycleHook(serialisedObject, object, target, true, true);
        // Targeting a ICustomSerialiser
        } else if (target && SerialisationService.isCustomSerialiser(target) && target.serialise) {
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
     * @param {Constructor<any> | ICustomSerialiser} target - The target for deserialisation
     * @returns {any} - a deserialised object based on target
     */
    // tslint:disable-next-line:no-any
    deserialise(object: any, target?: Constructor<any> | ICustomSerialiser) {
        // tslint:disable-next-line:no-any
        let deserialisedObject: any;

        // Targeting a Class
        if (target && !SerialisationService.isCustomSerialiser(target)) {
            // tslint:disable-next-line:no-any
            target = target as Constructor<any>;
            const classMeta = this.metaStore.getClass(target);

            deserialisedObject = new target();
            SerialisationService.callLifeCycleHook(deserialisedObject, object, target, false, false);
            classMeta.properties.forEach((propMeta) => {
                const deserialisationMeta = propMeta.getDeserialisationMeta();

                // If an override property name is specified, use it. Otherwise use the default.
                const deserialisedPropertyName =
                    deserialisationMeta.propertyNameOverride || propMeta.propertyName;

                // Deserialise the objects property according to its meta
                deserialisedObject[propMeta.propertyName] = this.deserialise(
                    object[deserialisedPropertyName], deserialisationMeta.target);
            });

            SerialisationService.callLifeCycleHook(deserialisedObject, object, target, false, true);
        // Targeting a ICustomSerialiser
        } else if (target && SerialisationService.isCustomSerialiser(target) && target.deserialise) {
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
     * @param {Constructor<any> | ICustomSerialiser} target - the target for serialization
     * @returns {any} - a serialized object based on target
     */
    // tslint:disable-next-line:no-any
    serialize(object: any, target?: Constructor<any> | ICustomSerialiser) { return this.serialise(object, target) }

    /**
     * Deserialize an object with the provided target. Valid targets are classes and custom serializers. If no
     * target is specified, this method will simply return what it was given. (Alternate method name)
     *
     * @param object - the json you wish to deserialize
     * @param {Constructor<any> | ICustomSerialiser} target - The target for deserialization
     * @returns {any} - a deserialized object based on target
     */
    // tslint:disable-next-line:no-any
    deserialize(object: any, target?: Constructor<any> | ICustomSerialiser) { return this.deserialise(object, target) }
}