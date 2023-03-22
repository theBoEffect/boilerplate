import { Request } from 'express';
import { AuthenticateOptions} from "passport";
import { Core } from "./Access";

export interface localRequest extends Request {
    orgContext?: string,
    group?: {
        core: {
            products: string[]
        }
    },
    allPermissions?: string[],
    userPermissions?: string[],
    enforceOwner?: boolean,
    authInfo?: localAuthInfo
}

export interface localAuthInfo extends Core.Access {
    token?: string
}