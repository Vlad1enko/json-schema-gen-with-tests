import { CorezoidSchema } from '../types/corezoidSchema';
import { ISchemaService, SchemaService } from './SchemaService';
import testSchema from './../constants/testSchema.json';

describe('#SchemaService', () => {
    let service: ISchemaService;

    beforeEach(() => {
        service = new SchemaService();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore all mocks to their original state
    });

    function generateObjectFromSchema(localSchema: CorezoidSchema) {
        return service.generateObjectFromSchema(localSchema, localSchema);
    }

    describe('#generateObjectFromJsonSchema', () => {
        it('should generate a valid object based on a complex schema', () => {
            jest.spyOn(global.Math, 'random').mockReturnValue(0.8);
            const generatedObject = service.generateObjectFromJsonSchema(
                JSON.stringify(testSchema)
            );

            expect(generatedObject).toStrictEqual({
                id: 81,
                title: 'xxxxxxxxxx',
                description: 'xxxxxxxxxx',
                startDate: 81,
                endDate: 81,
                attendees: [
                    {
                        userId: 81,
                        access: 'execute',
                        formAccess: 'execute_view'
                    },
                    {
                        userId: 81,
                        access: 'execute',
                        formAccess: 'execute_view'
                    },
                    {
                        userId: 81,
                        access: 'execute',
                        formAccess: 'execute_view'
                    },
                    {
                        userId: 81,
                        access: 'execute',
                        formAccess: 'execute_view'
                    },
                    {
                        userId: 81,
                        access: 'execute',
                        formAccess: 'execute_view'
                    }
                ],
                parentId: 81,
                locationId: 81,
                process:
                    'https://example.corezoid.com/api/1/json/public/123456/abcdef',
                readOnly: false,
                priorProbability: 80,
                channelId: 81,
                externalId: 'xxxxxxxxxx',
                tags: [],
                form: { id: 81, viewModel: {} },
                formValue: {}
            });

            expect(typeof generatedObject.id).toMatch(/string|number/);
            expect(typeof generatedObject.title).toBe('string');
            expect(typeof generatedObject.description).toBe('string');
            expect(typeof generatedObject.startDate).toBe('number');
            expect(typeof generatedObject.endDate).toBe('number');
            expect(Array.isArray(generatedObject.attendees)).toBe(true);
        });
    });

    describe('#generateObjectFromSchema', () => {
        describe('Object type', () => {
            const filledSchema: CorezoidSchema = Object.freeze({
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    age: { type: 'integer' },
                    surname: { type: 'string' }
                },
                required: ['name', 'age']
            });

            it('should generate an empty object when no properties are defined', () => {
                const schema: CorezoidSchema = { type: 'object' };
                const result = generateObjectFromSchema(schema);

                expect(result).toEqual({});
            });

            it('should generate an object with required properties', () => {
                jest.spyOn(global.Math, 'random').mockReturnValue(0);
                const result = generateObjectFromSchema(filledSchema);

                expect(result).toEqual({
                    name: expect.any(String),
                    age: expect.any(Number)
                });
            });

            it('should generate an object with optional properties', () => {
                jest.spyOn(global.Math, 'random').mockReturnValue(0.8);
                const result = generateObjectFromSchema(filledSchema);

                expect(result).toEqual({
                    name: expect.any(String),
                    age: expect.any(Number),
                    surname: expect.any(String)
                });
            });
        });

        describe('Array type', () => {
            it('should generate an empty array when items are not specified', () => {
                const arraySchema: CorezoidSchema = Object.freeze({
                    type: 'array',
                    minItems: 1
                });
                const result = generateObjectFromSchema(arraySchema);

                expect(result).toEqual([]);
            });

            it('should generate an array with minimum length', () => {
                const arraySchema: CorezoidSchema = Object.freeze({
                    type: 'array',
                    items: { type: 'integer' },
                    minItems: 1,
                    maxItems: 1
                });
                jest.spyOn(global.Math, 'random').mockReturnValue(0);
                const result = generateObjectFromSchema(arraySchema);

                expect(result).toStrictEqual([1]);
            });

            it('should generate an array with maximum length', () => {
                const arraySchema: CorezoidSchema = Object.freeze({
                    type: 'array',
                    items: { type: 'integer' },
                    minItems: 1,
                    maxItems: 5
                });
                jest.spyOn(global.Math, 'random').mockReturnValue(0.99);
                const result = generateObjectFromSchema(arraySchema);

                expect(result).toStrictEqual([100, 100, 100, 100, 100]);
            });

            it('should generate an array within given length limit', () => {
                const arraySchema: CorezoidSchema = Object.freeze({
                    type: 'array',
                    items: { type: 'integer' },
                    minItems: 3,
                    maxItems: 10
                });

                const results = Array.from({ length: 5 }, () =>
                    generateObjectFromSchema(arraySchema)
                );

                results.forEach((result) => {
                    expect(result.length).toBeGreaterThanOrEqual(3);
                    expect(result.length).toBeLessThanOrEqual(10);
                    result.forEach((item: any) => {
                        expect(typeof item).toBe('number');
                    });
                });
            });
        });

        describe('Boolean type', () => {
            const booleanSchema: CorezoidSchema = Object.freeze({
                type: 'boolean'
            });

            it('should generate false value', () => {
                jest.spyOn(global.Math, 'random').mockReturnValue(0.8);
                const result = generateObjectFromSchema(booleanSchema);

                expect(result).toBe(false);
            });

            it('should generate true value', () => {
                jest.spyOn(global.Math, 'random').mockReturnValue(0.3);
                const result = generateObjectFromSchema(booleanSchema);

                expect(result).toBe(true);
            });
        });

        describe('Integer type', () => {
            it('should generate precise integer', () => {
                const integerSchema: CorezoidSchema = Object.freeze({
                    type: 'integer',
                    minimum: 10,
                    maximum: 10
                });
                const result = generateObjectFromSchema(integerSchema);

                expect(result).toBe(10);
            });

            it('should generate integers within specified range', () => {
                const integerSchema: CorezoidSchema = Object.freeze({
                    type: 'integer',
                    minimum: 10,
                    maximum: 20
                });
                const result = generateObjectFromSchema(integerSchema);

                expect(result).toBeGreaterThanOrEqual(10);
                expect(result).toBeLessThanOrEqual(20);
            });
        });

        describe('Number type', () => {
            it('should generate precise number', () => {
                const numberSchema: CorezoidSchema = Object.freeze({
                    type: 'number',
                    minimum: 10.5,
                    maximum: 10.5
                });
                const result = generateObjectFromSchema(numberSchema);

                expect(result).toBe(10.5);
            });

            it('should generate numbers within specified range', () => {
                const numberSchema: CorezoidSchema = Object.freeze({
                    type: 'number',
                    minimum: 12.5,
                    maximum: 13
                });
                const result = generateObjectFromSchema(numberSchema);

                expect(result).toBeGreaterThanOrEqual(12.5);
                expect(result).toBeLessThanOrEqual(13);
            });
        });

        describe('String type', () => {
            it('should generate strings based on a pattern if provided', () => {
                const stringSchema: CorezoidSchema = Object.freeze({
                    type: 'string',
                    pattern: 'fixedString'
                });
                const result = generateObjectFromSchema(stringSchema);

                expect(result).toBe(
                    'https://example.corezoid.com/api/1/json/public/123456/abcdef'
                );
            });

            it('should generate random strings if pattern is not provided', () => {
                const stringSchema: CorezoidSchema = Object.freeze({
                    type: 'string'
                });
                const result = generateObjectFromSchema(stringSchema);

                expect(result).toEqual(expect.any(String));
                expect(result.length).toBe(10);
            });
        });

        describe('Enum type', () => {
            const enumSchema: CorezoidSchema = {
                enum: ['red', 'green', 'blue']
            };

            it('should generate the value "red" from enum options', () => {
                jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
                const result = generateObjectFromSchema(enumSchema);
                expect(result).toBe('red');
            });

            it('should generate the value "green" from enum options', () => {
                jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
                const result = generateObjectFromSchema(enumSchema);
                expect(result).toBe('green');
            });

            it('should generate the value "blue" from enum options', () => {
                jest.spyOn(global.Math, 'random').mockReturnValue(0.9);
                const result = generateObjectFromSchema(enumSchema);
                expect(result).toBe('blue');
            });
        });

        describe('Handling $ref', () => {
            const rootSchema: CorezoidSchema = Object.freeze({
                definitions: {
                    refSchema: {
                        $id: '#myRef',
                        type: 'string'
                    }
                }
            });
            const refSchema: CorezoidSchema = Object.freeze({ $ref: '#myRef' });

            it('should resolve references within the schema', () => {
                const result = service.generateObjectFromSchema(
                    refSchema,
                    rootSchema
                );

                expect(result).toEqual(expect.any(String));
            });

            it('should throw an error if the referenced schema is not found', () => {
                const schemaWithInvalidRef = {
                    $ref: '#nonExistentSchema'
                };

                expect(() => {
                    service.generateObjectFromSchema(
                        schemaWithInvalidRef,
                        rootSchema
                    );
                }).toThrow(
                    `Schema with $id '#nonExistentSchema' not found in definitions.`
                );
            });

            it('should throw an error if no definitions are present in the root schema', () => {
                const schemaWithRef = {
                    $ref: '#myRef'
                };
                const emptyRootSchema = {};

                expect(() => {
                    service.generateObjectFromSchema(
                        schemaWithRef,
                        emptyRootSchema
                    );
                }).toThrow('No definitions found in the root schema.');
            });
        });

        describe('Handling anyOf', () => {
            const anyOfSchema = Object.freeze({
                anyOf: [{ enum: ['apple', 'banana'] }, { type: 'number' }]
            });

            it('should generate string from enum', () => {
                jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
                const result = generateObjectFromSchema(anyOfSchema);

                expect(['apple', 'banana']).toContain(result);
            });

            it('should generate number', () => {
                jest.spyOn(global.Math, 'random').mockReturnValue(0.6);
                const result = generateObjectFromSchema(anyOfSchema);

                expect(typeof result).toBe('number');
            });
        });

        describe('Handling default property', () => {
            it('should use default value when no type is specified', () => {
                const defaultSchema = {
                    default: 'default-value'
                };
                const result = service.generateObjectFromSchema(
                    defaultSchema,
                    defaultSchema
                );

                expect(result).toBe('default-value');
            });

            it('should use null value when neither type nor default is specified', () => {
                const defaultSchema = {};
                const result = service.generateObjectFromSchema(
                    defaultSchema,
                    defaultSchema
                );

                expect(result).toBeNull();
            });

            it('should not use default value when type is specified', () => {
                const defaultSchema = {
                    default: 'default-value',
                    type: 'number'
                };
                const result = service.generateObjectFromSchema(
                    defaultSchema,
                    defaultSchema
                );

                expect(result).toEqual(expect.any(Number));
            });
        });
    });
});
