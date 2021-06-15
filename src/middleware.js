import { OpenApiValidator } from 'express-openapi-validate';
import Boom from '@hapi/boom';
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
        next(handleErrors.catch404());
    },
    async catchErrors (err, req, res, next) {
        const error = await handleErrors.parse(err);
        return res.respond(error);
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
                copyright: `Copyright (c) ${date.getFullYear()} theBoEffect LLC`
            }
        });
    },
    async schemaCheck(req, res, next) {
        try {
            let path  = `/api${req.route.path}`;
            await Promise.all(Object.keys(req.params).map((p)=>{
                path = path.replace(`:${p}`, `{${p}}`);
            }));
            return schema.validate(req.method.toString().toLowerCase(), path.toLowerCase())(req, res, next);
        } catch (error) {
            next(Boom.expectationFailed(error.message || 'Something unexpected went wrong validating OpenAPI Schema'));
        }
    },
}