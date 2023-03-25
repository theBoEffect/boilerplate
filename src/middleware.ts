import { OpenApiValidator } from 'express-openapi-validate';
import { NextFunction, ErrorRequestHandler, Request, Response } from 'express';
import Boom from '@hapi/boom';
import { v4 as uuid } from 'uuid';
import handleErrors from './customErrorHandler';
import { responseIntercept } from './say';
import openApi from './swagger';
//import swag from './swagger';
import mongoose from "mongoose";
import auth from './auth/auth';
import core from './api/core/core';
import permissions from './permissions';
import {Operation} from "express-openapi-validate/dist/OpenApiDocument";

const p = require('../package.json');

const date = new Date();
//const schema = new OpenApiValidator(swag, { ajvOptions: { formats: { email: true, password: true, uri: true, url: true, uuid: true } } });

export default {
    cores (req: Request, res: Response, next: NextFunction): any {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, DELETE, PUT, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, api_key, Authorization');
        next();
    },
    catch404 (req: Request, res: Response, next: NextFunction): any {
        try {
            next(handleErrors.catch404());
        } catch (error) {
            next(error);
        }
    },
    async requestId(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            if(req.requestId) return next();
            // try mapping from gateway if the request is missing...
            if(req.headers['x-request-id']) {
                req.requestId = req.headers['x-request-id'];
                return next();
            }
            // create our own
            req.requestId = uuid();
            return next();
        } catch (error) {
            next(error);
        }
    },
    async catchErrors (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction): Promise<object> {
        try {
            const error = await handleErrors.parse(err, req.requestId);
            return res.respond(error);
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ error: 'Unexpected Error - See Logs', message: error.message || error });
        }
    },
    responseIntercept: responseIntercept,
    async health (req: Request, res: Response): Promise<object> {
        return res.json({
                server: 'running',
                db: mongoose.STATES[mongoose.connection.readyState]
            }
        );
    },
    async version (req: Request, res: Response): Promise<object> {
        return res.json( {
            data: {
                api: p.name,
                version: p.version,
                copyright: `Copyright (c) ${date.getFullYear()} ${p.author}`
            }
        });
    },
    async schemaCheck(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const swag = await openApi.getSpec();
            const schema = new OpenApiValidator(swag, { ajvOptions: { formats: { email: true, password: true, uri: true, url: true, uuid: true } } });
            let path  = `${req.route.path}`;
            await Promise.all(Object.keys(req.params).map((p)=>{
                path = path.replace(`:${p}`, `{${p}}`);
            }));
            return schema.validate(<Operation>req.method.toString().toLowerCase(), path.toLowerCase())(req, res, next);
        } catch (error: any) {
            next(Boom.expectationFailed(error.message || 'Something unexpected went wrong validating OpenAPI Schema'));
        }
    },
    validateAG: core.validateAG,
    getOrgContext: core.getOrgContext,
    isAuthenticated: auth.isAuthenticated,
    isPlatformAuthenticated: auth.isPlatformAuthenticated,
    isOAuthSecured: auth.isOAuthSecured,
    isAnyAuth: auth.isAnyAuth,
    isCCorPlatform: auth.isCCorPlatform,
    enforce: permissions.enforce
}