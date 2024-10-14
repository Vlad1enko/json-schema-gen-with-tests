export interface CorezoidSchema {
    $id?: string;
    type?: string;
    properties?: { [key: string]: CorezoidSchema };
    items?: CorezoidSchema;
    required?: string[];

    enum?: any[];
    default?: any;

    // refs
    $ref?: string;
    definitions?: { [key: string]: CorezoidSchema };

    // discrette
    anyOf?: CorezoidSchema[];
    // NOTICE: the below discrette operations were not requested in your example,
    // but they existed by this url https://json-schema.org/draft-07/schema#
    allOf?: CorezoidSchema[];
    oneOf?: CorezoidSchema[];

    // validation
    minimum?: number;
    maximum?: number;
    minItems?: number;
    maxItems?: number;
    pattern?: string;
}
