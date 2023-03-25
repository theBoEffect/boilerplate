import { Core } from "./ICoreTypes";

export interface IAuthInfo extends Core.Access {
    token?: string
    [key: string]: any
}

export type DoneFunction = (err: any, user?: object | false | null, authInfo?: IAuthInfo | null ) => void;