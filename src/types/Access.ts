export namespace Core {
    export interface Access {
        'x-access-url'?: string,
        client_credential?: boolean,
        group?: string,
        'x-access-products'?: {
            [key: string]: string
        },
        'x-access-permissions'?: {
            [key: string]: string
        },
        'x-access-roles'?: {
            [key: string]: string
        },
        'x-access-domains': {
            [key: string]: string
        }
    }
}