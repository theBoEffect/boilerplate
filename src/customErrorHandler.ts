import Boom, { Boom as IB, Payload } from '@hapi/boom';
import { IErrors, IPayload } from './types';
import {v4 as uuid} from "uuid";

export default {
    catch404(): IB {
        return Boom.notFound('Resource not found');
    },
    async parse(error: any, id: string | undefined = undefined): Promise<IErrors | Payload> {
        try {
            if(error.code === 11000) {
                const conflict = Boom.conflict(
                    error.errmsg.split('E11000 duplicate key error collection: ').join('')
                );
                return conflict.output.payload;
            }
            const tE = await doParse(error);
            const err = tE.output.payload;
            if(id) tE.output.payload['id'] = <string>id;
            return logger(err, tE);
        } catch (error) {
            const result = await doParse(error);
            console.error(result);
            return result.output.payload;
        }

    }
}

async function doParse(error: any) {
    let tE = error;
    if (!Boom.isBoom(error)) tE = Boom.boomify(error);
    // openApi adjustment
    if(error.name === 'ValidationError') {
        tE.output.statusCode = error.statusCode;
        tE.output.payload.statusCode = error.statusCode;
        tE.output.payload.error = error.name;
        tE.output.payload.message = error.message;
    }
    if (tE.output.payload.message !== error.message) {
        tE.output.payload.message = `${tE.output.payload.message} -details: ${error.message}`;
    }
    if (tE.data) tE.output.payload.data = tE.data;
    return tE;
}

async function logger (err: IErrors, tE: IB): Promise<IErrors> {
    try {
        const nE = await setupError(tE.output.payload);
        err.id = nE.id;
        return err;
    } catch (error) {
        const result = await doParse(error);
        console.error(result);
        return result.output.payload;
    }
}

async function setupError(data: any): Promise<IErrors> {
    const error: IErrors = {
        id: data?.id || uuid(),
        thrown: Date.now(),
        message: (data?.message) ? data?.message : 'unknown error',
    }
    if(data?.id) delete data?.id;
    data.thrown = error.thrown;
    error.details = data;
    return error;
}