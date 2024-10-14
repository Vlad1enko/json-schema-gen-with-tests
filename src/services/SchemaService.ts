import { CorezoidSchema } from '../types/corezoidSchema';

export interface ISchemaService {
    generateObjectFromSchema(
        schema: CorezoidSchema,
        rootSchema: CorezoidSchema
    ): any;
    generateObjectFromJsonSchema(jsonSchema: string): any;
}

interface SchemaServiceConstructor {
    new (): ISchemaService;
}

export const SchemaService = function () {
    // HANDLING OBJECTS
    function generateObject(
        schema: CorezoidSchema,
        rootSchema: CorezoidSchema
    ): object {
        if (!schema.properties) {
            return {};
        }

        const obj: any = {};

        for (const key in schema.properties) {
            if (schema.required?.includes(key) || Math.random() > 0.5) {
                obj[key] = generateObjectFromSchema(
                    schema.properties[key],
                    rootSchema
                );
            }
        }

        return obj;
    }

    // HANDLING ARRAYS
    function generateArray(
        schema: CorezoidSchema,
        rootSchema: CorezoidSchema
    ): any[] {
        if (!schema.items) {
            return [];
        }

        const { minItems = 1, maxItems = 5 } = schema;
        const length =
            Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

        return Array.from({ length }, () =>
            generateObjectFromSchema(schema.items!, rootSchema)
        );
    }

    // HANDLING BOOLEAN
    function generateBoolean(): boolean {
        return Math.random() < 0.5;
    }

    // HANDLING INTEGER
    function generateInteger(schema: CorezoidSchema): number {
        const { minimum = 1, maximum = 100 } = schema;
        // including both min and max: [min, max]
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    // HANDLING NUMBER
    function generateNumber(schema: CorezoidSchema): number {
        const { minimum = 1, maximum = 100 } = schema;
        const number = Math.random() * (maximum - minimum) + minimum;
        return parseFloat(number.toFixed(2));
    }

    // HANDLING STRING
    function generateString(schema: CorezoidSchema): string {
        if (schema.pattern) {
            return 'https://example.corezoid.com/api/1/json/public/123456/abcdef'; // to simplify the solution, I use the matched string
        }

        return getRandomString(10);
    }

    function getRandomString(length: number) {
        let result = '';
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }

        return result;
    }

    // HANDLING ENUM
    function generateEnum(schema: CorezoidSchema): string {
        return schema.enum?.[Math.floor(Math.random() * schema.enum.length)];
    }

    // HANDLING REFS
    function resolveReference(
        ref: string,
        rootSchema: CorezoidSchema
    ): CorezoidSchema {
        if (!rootSchema.definitions) {
            throw new Error(`No definitions found in the root schema.`);
        }

        for (const key in rootSchema.definitions) {
            if (rootSchema.definitions[key].$id === ref) {
                return rootSchema.definitions[key];
            }
        }

        throw new Error(`Schema with $id '${ref}' not found in definitions.`);
    }

    // HANDLING SCHEMAS
    function generateObjectFromSchema(
        schema: CorezoidSchema,
        rootSchema: CorezoidSchema
    ): any {
        if (schema.$ref) {
            schema = resolveReference(schema.$ref, rootSchema);
        } else if (schema.anyOf) {
            const randomSchemaIndex = Math.floor(
                Math.random() * schema.anyOf.length
            );
            return generateObjectFromSchema(
                schema.anyOf[randomSchemaIndex],
                rootSchema
            );
        } else if (schema.enum) {
            return generateEnum(schema);
        }
        // NOTICE: these discrette operations were not requested in your example,
        // but they existed by this url https://json-schema.org/draft-07/schema#
        //
        // else if (schema.allOf) {
        //     return Object.assign(
        //         {},
        //         ...schema.allOf.map((s) =>
        //             generateObjectFromSchema(s, rootSchema)
        //         )
        //     );
        // } else if (schema.oneOf) {
        //     return generateObjectFromSchema(
        //         schema.oneOf[Math.floor(Math.random() * schema.oneOf.length)],
        //         rootSchema
        //     );
        // }

        switch (schema.type) {
            case 'object':
                return generateObject(schema, rootSchema);
            case 'array':
                return generateArray(schema, rootSchema);
            case 'boolean':
                return generateBoolean();
            case 'integer':
                return generateInteger(schema);
            case 'number':
                return generateNumber(schema);
            case 'string':
                return generateString(schema);
            default:
                return schema.default ?? null;
        }
    }

    function generateObjectFromJsonSchema(jsonSchema: string): any {
        const parsedSchema = JSON.parse(jsonSchema);
        return generateObjectFromSchema(parsedSchema, parsedSchema);
    }

    return {
        generateObjectFromSchema,
        generateObjectFromJsonSchema
    };
} as any as SchemaServiceConstructor;
