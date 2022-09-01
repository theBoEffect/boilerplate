import { OpenApiValidator } from 'express-openapi-validate';
import Boom from '@hapi/boom';
import { v4 as uuid } from 'uuid';
import handleErrors from './customErrorHandler';
import { sayMiddleware } from './say';
import swag from './swagger';
import mongoose from "mongoose";

const p = require('../package.json');

const date = new Date();
const schema = new OpenApiValidator(swag, { ajvOptions: { formats: { email: true, password: true, uri: true, url: true, uuid: true } } });

export default {
    cores (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, DELETE, PUT, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, api_key, Authorization');
        next();
    },
    catch404 (req, res, next) {
        try {
            next(handleErrors.catch404());
        } catch (error) {
            next(error);
        }
    },
    async requestId(req, res, next) {
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
    async catchErrors (err, req, res, next) {
        try {
            const error = await handleErrors.parse(err, req.requestId);
            return res.respond(error);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Unexpected Error - See Logs', message: error.message || error });
        }
    },
    responseIntercept: sayMiddleware.responseIntercept,
    async health (req, res) {
        return res.json(
            {
                server: 'running',
                db: mongoose.STATES[mongoose.connection.readyState]
            }
        );
    },
    async version (req, res) {
        return res.json( {
            data: {
                api: p.name,
                version: p.version,
                copyright: `Copyright (c) ${date.getFullYear()} ${p.author}`
            }
        });
    },
    async schemaCheck(req, res, next) {
        try {
            let path  = `${req.route.path}`;
            await Promise.all(Object.keys(req.params).map((p)=>{
                path = path.replace(`:${p}`, `{${p}}`);
            }));
            return schema.validate(req.method.toString().toLowerCase(), path.toLowerCase())(req, res, next);
        } catch (error) {
            next(Boom.expectationFailed(error.message || 'Something unexpected went wrong validating OpenAPI Schema'));
        }
    },
}