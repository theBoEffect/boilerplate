import { IAuthInfo} from "./IAuthInfo";

export declare global {
    namespace Express {
        interface Request {
            orgContext?: string,
            authGroup?: string,
            OP?: string,
            group?: {
                groupId: string,
                preferredOP: string,
                core: {
                    products: string[]
                    org?: {
                        id: string
                    }
                }
            },
            allPermissions?: string[],
            userPermissions?: string[],
            enforceOwner?: boolean,
            requestId?: any,
            authInfo?: IAuthInfo
        }
        interface Response {
            respond(output: any): object
        }
    }
}
