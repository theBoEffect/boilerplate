import { Request, Response, NextFunction} from "express";
import openApi from '../../swagger.js';
import modify from './swag.js';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pJson = require('../../../package.json');

export default {
    async serveVersion(req: Request, res: Response, next: NextFunction) {
        try {
            const date = new Date();
            return res.render('index', {
                title: pJson.name,
                version: pJson.version,
                description: pJson.description,
                by: pJson.author,
                url: pJson.person.url,
                year: date.getFullYear(),
                home: pJson.homepage
            });
        } catch (e) {
            next(e)
        }
    },
    async serveSwaggerUI(req: Request, res: Response, next: NextFunction) {
        try {
            return res.render('swagger', { title: pJson.name })
        } catch (e) {
            next(e);
        }
    },
    async serveApiJson(req: Request, res: Response) {
        try{
            let swag = JSON.parse(JSON.stringify(await openApi.getSpec()));
            swag = modify.updateSwag(swag);
            return res.json(swag);
        }catch (error) {
            console.info(error);
            return res.json(await openApi.getSpec());
        }
    },
    async reDocApi(req: Request, res: Response, next: NextFunction) {
        try {
            return res.render('api', { title: pJson.name })
        } catch (e) {
            next(e);
        }
    },
    async oauth2Redirect(req: Request, res: Response, next: NextFunction) {
        try {
            return res.render('openapi-redirect');
        } catch (e) {
            next(e);
        }
    }
};