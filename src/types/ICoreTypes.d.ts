import { JwtPayload } from 'jsonwebtoken';

export namespace Core {
    export interface CheckDecoded {
        client_credential: boolean,
        sub: string,
        client_id: string
        decoded: Decoded
    }

    export interface Decoded extends JwtPayload {
        nonce?: string,
        iss: string,
        group: string,
        exp?: number,
        aud?: string | string[],
        client_id: string,
        sub?: string,
        email?: string,
    }

    export interface Access {
        client_credential?: boolean,
        group?: string,
        'x-access-url'?: string,
        'x-access-method'?: string,
        'x-access-group'?: string,
        'x-organization-context'?: string,
        'x-access-organizations'?: string,
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
        },
        'x-federated-token'?: string
    }
}