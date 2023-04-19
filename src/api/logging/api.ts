import Boom from '@hapi/boom';
import { Request, Response, NextFunction} from "express";
import { say } from '../../say/index.js';
import biz from './logic.js';

// update this for your resource
const RESOURCE = 'LOG';

const api = {
    async write(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            if (!req.body.message) throw Boom.preconditionRequired('message is required');
            const result = await biz.write(req.body);
            return res.respond(say.created(result, RESOURCE));
        } catch (error) {
            next(error);
        }
    },
    async get(req: Request, res: Response, next: NextFunction): Promise<any>  {
        try {
            const result = await biz.get(req.query);
            return res.respond(say.ok(result, RESOURCE));
        } catch (error) {
            next(error);
        }
    },
    async getOne(req: Request, res: Response, next: NextFunction): Promise<any>  {
        try {
            if(!req.params.id) throw Boom.preconditionRequired('Must provide id');
            const result = await biz.getOne(req.params.id);
            if (!result) throw Boom.notFound(`id requested was ${req.params.id}`);
            return res.respond(say.ok(result, RESOURCE));
        } catch (error) {
            next(error);
        }
    },
    async patch(req: Request, res: Response, next: NextFunction): Promise<any>  {
        try {
            const result = await biz.patch(req.params.id, req.body);
            return res.respond(say.ok(result, RESOURCE));
        } catch (error) {
            next(error);
        }
    }
};

export default api;