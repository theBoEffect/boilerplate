import { IResponseOutput } from '../types'

export default {
    ok(data: any = 'OK', type='RESPONSE'): IResponseOutput {
        return {
            statusCode: 200,
            type,
            data
        }
    },
    created(data: any ='Created', type='RESPONSE'): IResponseOutput {
        return {
            statusCode: 201,
            type,
            data
        }
    },
    noContent(type='RESPONSE'): IResponseOutput {
        return {
            statusCode: 204,
            type,
        }
    },
    accepted(data: any ='Accepted', type='RESPONSE'): IResponseOutput {
        return {
            statusCode: 202,
            type,
            data
        }
    },
    partial(data: any ='Partial Content', type='RESPONSE'): IResponseOutput {
        return {
            statusCode: 206,
            type,
            data
        }
    },
    specifically(statusCode: number, data: any, type: string, error: any, message: string): IResponseOutput {
        return {
            statusCode,
            type,
            data,
            error,
            message
        };
    }
}