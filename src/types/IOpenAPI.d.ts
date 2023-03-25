import { OpenAPIV3_1 } from "openapi-types";

export namespace IOpenAPI {
    export interface InfoObject extends OpenAPIV3_1.InfoObject {
        'x-logo': {
            url: string
        }
    }
    export interface Document extends OpenAPIV3_1.Document {
        info: InfoObject,
        jsonSchemaDialect?: string,
        servers: OpenAPIV3_1.ServerObject[]
    }
}

/*
export declare global {
    namespace OpenAPIV3_1 {
        interface InfoObject {
            'x-logo'?: {
                url?: string
            }
        }
    }
}

 */