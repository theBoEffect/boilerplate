import Boom from '@hapi/boom';
import { Request, Response, NextFunction} from "express";
import { say } from '../../say';
import logs from './logs';

const RESOURCE = 'LOG';

const api = {
    async writeLog(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            if (!req.body.message) throw Boom.preconditionRequired('message is required');
            const result = await logs.writeLog(req.body);
            return res.respond(say.created(result, RESOURCE));
        } catch (error) {
            next(error);
        }
    },
    async getLogs(req: Request, res: Response, next: NextFunction): Promise<any>  {
        try {
            const result = await logs.getLogs(req.query);
            return res.respond(say.ok(result, RESOURCE));
        } catch (error) {
            next(error);
        }
    },
    async getLog(req: Request, res: Response, next: NextFunction): Promise<any>  {
        try {
            if(!req.params.id) throw Boom.preconditionRequired('Must provide id');
            const result = await logs.getLog(req.params.id);
            if (!result) throw Boom.notFound(`id requested was ${req.params.id}`);
            return res.respond(say.ok(result, RESOURCE));
        } catch (error) {
            next(error);
        }
    },
    async patchLog(req: Request, res: Response, next: NextFunction): Promise<any>  {
        try {
            const result = await logs.patchLog(req.params.id, req.body);
            return res.respond(say.ok(result, RESOURCE));
        } catch (error) {
            next(error);
        }
    }
};

export default api;