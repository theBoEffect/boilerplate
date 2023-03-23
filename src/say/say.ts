import { IResponseOutput } from '../types'

export default {
    ok(data='OK', type='RESPONSE'): IResponseOutput {
        return {
            statusCode: 200,
            type,
            data
        }
    },
    created(data='Created', type='RESPONSE'): IResponseOutput {
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
    accepted(data='Accepted', type='RESPONSE'): IResponseOutput {
        return {
            statusCode: 202,
            type,
            data
        }
    },
    partial(data='Partial Content', type='RESPONSE'): IResponseOutput {
        return {
            statusCode: 206,
            type,
            data
        }
    },
    specifically(statusCode: number, data: string | object, type: string, error: any, message: string): IResponseOutput {
        return {
            statusCode,
            type,
            data,
            error,
            message
        };
    }
}