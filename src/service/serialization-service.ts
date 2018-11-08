import {Constructor} from '../util/constructor';
import {ICustomSerializer} from '../util/custom-serializer.interface';
import {SerializationMetaStore} from "../meta/serialization-meta-store";

/**
 * SerializationService
 *
 * Exposed as 'Cereal'. Provides functions that serialize/deserialize objects based on information from its meta store.
 */
export class SerializationService {
    metaStore: SerializationMetaStore = new SerializationMetaStore();

    supportCircularReferences = true;
    idProperty = '@id';

    // tslint:disable-next-line:no-any
    serializationIdMap: Map<any, number> = new Map<any, number>();
    serializationId = 0;

    // tslint:disable-next-line:no-any
    deserializationIdMap: Map<number, any> = new Map<number, any>();

    /**
     * Type guard for CustomSerializers
     *
     * @param {object} target
     * @returns {type is ICustomSerializer} - whether the passed value has methods for custom serialization
     */
    static isCustomSerializer(target: object): target is ICustomSerializer {
        return 'serialize' in target || 'deserialize' in target;
    }

    // tslint:disable-next-line:no-any
    static callLifeCycleHook(processedObject: any, originalObject: any, target: any, wasSerialized: boolean, isAfterHook: boolean) {
        if (isAfterHook) {
            if (wasSerialized && target.AfterSerialized) {
                target.AfterSerialized(processedObject, originalObject);
            } else if (target.AfterDeserialized) {
                target.AfterDeserialized(processedObject, originalObject);
            }
        } else {
            if (wasSerialized && target.BeforeSerialized) {
                target.BeforeSerialized(processedObject, originalObject);
            } else if (target.BeforeDeserialized) {
                target.BeforeDeserialized(processedObject, originalObject);
            }
        }
    }

    /**
     * Serialize an object with the provided target. Valid targets are classes and custom serializers. If no
     * target is specified, this method will simply return what it was given.
     *
     * @param object - the value you wish to serialize
     * @param {Constructor<any> | ICustomSerializer} target - the target for serialization
     * @returns {any} - a serialized object based on target
     */
    // tslint:disable-next-line:no-any
    serialize(object: any, target?: Constructor<any> | ICustomSerializer) {
        // tslint:disable-next-line:no-any
        let serializedObject: any;

        // Targeting a Class
        if (target && !SerializationService.isCustomSerializer(target) && object) {
            if (Array.isArray(object)) {
                serializedObject = [];
                for (let i = 0; i < object.length; i++) {
                    const objectElement = object[i];
                    serializedObject.push(this.serialize(objectElement, target));
                }
            } else {
                // Check if we've already serialized this object. If we have, then output the objects ID instead
                if (this.serializationIdMap.has(object) && this.supportCircularReferences) {
                    serializedObject = this.serializationIdMap.get(object);

                // This is the first time we've encountered this object, serialise it and add it to the map with an ID
                } else {
                    serializedObject = {};

                    if (this.supportCircularReferences) {
                        this.serializationIdMap.set(object, ++this.serializationId);
                        serializedObject[this.idProperty] = this.serializationId;
                    }

                    SerializationService.callLifeCycleHook(serializedObject, object, target, true, false);
                    const classMeta = this.metaStore.getClass(target);

                    classMeta.properties.forEach((propMeta) => {
                        const serializationMeta = propMeta.getSerializationMeta();

                        // If an override property name is specified, use it. Otherwise use the default.
                        const serializedPropertyName =
                            serializationMeta.propertyNameOverride || propMeta.propertyName;

                        // Serialize the objects property according to its meta
                        serializedObject[serializedPropertyName] = this.serialize(
                            object[propMeta.propertyName], serializationMeta.target);
                    });

                    SerializationService.callLifeCycleHook(serializedObject, object, target, true, true);
                }
            }
        // Targeting a ICustomSerializer
        } else if (target && SerializationService.isCustomSerializer(target) && target.serialize) {
            serializedObject = target.serialize(object);

        // No target, return object value provided
        } else {
            serializedObject = object;
        }

        return serializedObject;
    }

    /**
     * Deserialize an object with the provided target. Valid targets are classes and custom serializers. If no
     * target is specified, this method will simply return what it was given.
     *
     * @param object - the json you wish to deserialize
     * @param {Constructor<any> | ICustomSerializer} target - The target for deserialization
     * @returns {any} - a deserialized object based on target
     */
    // tslint:disable-next-line:no-any
    deserialize(object: any, target?: Constructor<any> | ICustomSerializer) {
        // tslint:disable-next-line:no-any
        let deserializedObject: any;

        // Targeting a Class
        if (target && !SerializationService.isCustomSerializer(target) && object) {
            if (Array.isArray(object)) {
                deserializedObject = [];
                for (let i = 0; i < object.length; i++) {
                    const objectElement = object[i];
                    deserializedObject.push(this.deserialize(objectElement, target));
                }
            } else {
                // If the passed value is a number when we're expecting to deserialise an object, it's likely an ID
                if (!isNaN(object) && this.deserializationIdMap.has(object) && this.supportCircularReferences) {
                    deserializedObject = this.deserializationIdMap.get(object);
                } else {
                    // tslint:disable-next-line:no-any
                    target = target as Constructor<any>;
                    const classMeta = this.metaStore.getClass(target);

                    deserializedObject = new target();

                    if (this.supportCircularReferences) {
                        this.deserializationIdMap.set(object[this.idProperty], deserializedObject);
                    }

                    SerializationService.callLifeCycleHook(deserializedObject, object, target, false, false);
                    classMeta.properties.forEach((propMeta) => {
                        const deserializationMeta = propMeta.getDeserializationMeta();

                        // If an override property name is specified, use it. Otherwise use the default.
                        const deserializedPropertyName =
                            deserializationMeta.propertyNameOverride || propMeta.propertyName;

                        // Deserialize the objects property according to its meta
                        deserializedObject[propMeta.propertyName] = this.deserialize(
                            object[deserializedPropertyName], deserializationMeta.target);
                    });

                    SerializationService.callLifeCycleHook(deserializedObject, object, target, false, true);
                }
            }
        // Targeting a ICustomSerializer
        } else if (target && SerializationService.isCustomSerializer(target) && target.deserialize) {
            deserializedObject = target.deserialize(object);

        // No target, return object value provided
        } else {
            deserializedObject = object;
        }

        return deserializedObject;
    }

    resetSerializationIdMap() {
        this.serializationIdMap.clear();
        this.serializationId = 0;
    }

    resetDeserializationIdMap() {
        this.deserializationIdMap.clear();
    }
}