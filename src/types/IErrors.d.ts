import { Payload } from "@hapi/boom";

export interface IErrors {
    id: string,
    message: string,
    thrown: number,
    details?: object,
    code?: string | number,
    [key: string]: any
}

export interface IPayload extends Payload {
    id: string
}