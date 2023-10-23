import {jest} from '@jest/globals'
import Boom from "@hapi/boom";
import ref from '@apidevtools/json-schema-ref-parser';
import merge from 'json-schema-resolve-allof';
import yaml from 'yamljs';
import fs from 'fs';
import { fail } from './testhelper';
jest.mock('express-openapi-validate');
import openApi from '../swagger.js';
import errorHandler from '../customErrorHandler.js';
import m from '../middleware.js';
import helper from '../helper.js';
import connect from "../connection.js";

describe('Error handler tests', () => {
    test('make sure error handler returns 404', async () => {
        try {
            let response = errorHandler.catch404();
            expect(response.isBoom).toBe(true);
            expect(response.output.statusCode).toBe(404);
            expect(response.output.payload.statusCode).toBe(404);
        } catch (error) {
            fail(error);
        }

    });

    test('make sure error parser works with system error', async () => {
        try {
            let response = await errorHandler.parse(new Error('Something strange in the neighborhood'));
            expect(response.statusCode).toBe(500);
        } catch (error) {
            fail(error);
        }

    });

    test('make sure error parser works with Boom 400 error', async () => {
        try {
            let response = await errorHandler.parse(Boom.badRequest('This is a test'));
            expect(response.statusCode).toBe(400);
        } catch (error) {
            fail(error);
        }
    });
});


describe('Middleware tests', () => {
    test('make sure cors headers are set', async () => {
        try {
            const req = {}, res = { sendStatus: jest.fn(), header: jest.fn() }, next = jest.fn();
            await m.cores(req, res, next);
            expect(res.header).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
            expect(res.header).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, HEAD, POST, DELETE, PUT, PATCH, OPTIONS');
            expect(res.header).toHaveBeenCalledWith('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, api_key, Authorization');
            expect(next).toHaveBeenCalled();
        } catch (error) {
            fail(error);
        }
    });

    test('make sure catch404 middleware works', async () => {
        try {
            const req = {}, res = { sendStatus: jest.fn(), header: jest.fn() }, next = jest.fn();
            await m.catch404(req, res, next);
            expect(next).toHaveBeenCalledWith(Boom.notFound('Resource not found'));
        } catch (error) {
            fail(error);
        }
    });

    test('make sure catchError response works', async () => {
        try {
            const err = Boom.badRequest('This is a test'), req = {}, res = { respond: jest.fn(), header: jest.fn() }, next = jest.fn();
            await m.catchErrors(err, req, res, next);
            const expected = {
                error: "Bad Request",
                id: expect.any(String),
                message: "This is a test",
                thrown: expect.any(Number),
                statusCode: 400,
            };
            console.info(expected);
            console.info(res.respond);
            expect(res.respond).toHaveBeenCalledWith(expected);
        } catch (error) {
            fail(error);
        }
    });
});


describe('Swagger / OpenAPI parser test', () => {
    test('make sure swagger.js returns contents correctly based on swagger.yaml', async () => {
        try {
            let raw = yaml.parse(fs.readFileSync('./swagger.yaml', 'utf8'));
            raw = await openApi.agg(raw);
            const doc = await merge(await ref.dereference(raw));
            const swag = await openApi.init();
            expect(swag).toStrictEqual(doc);
        } catch (error) {
            fail(error);
        }
    });
});

describe('Helper tests', () => {
    test('isJson returns true when a string is passed that is infact valid JSON', async () => {
        try {
            const valid = helper.isJson(JSON.stringify({ test: 'ok' }));
            expect(valid).toBe(true);
            const invalid = helper.isJson('{test:ok}');
            expect(invalid).toBe(false);
        } catch (error) {
            fail(error);
        }
    });

    test('elementExists works as expected', async () => {
        try {
            const valid = helper.elementExists('test', 'ok', [{ test: 'ok'}]);
            expect(valid).toBe(true);
            const invalid = helper.elementExists('test', 'oks', [{ test: 'ok'}]);
            expect(invalid).toBe(false);
        } catch (error) {
            fail(error);
        }
    });

    test('oData parser returns an object ready for use by mongo dal', async () => {
        try {
            const query = {
                $filter: 'count eq 2',
                $select: 'x',
                $skip: 2,
                $top: 1,
                $orderby: 'timestamp desc'
            };
            const result = await helper.parseOdataQuery(query);
            expect(result.query).toStrictEqual({ "count": 2 });
            expect(result.sort).toStrictEqual({ "timestamp": -1 });
            expect(result.projection).toStrictEqual({ "x": 1 });
            expect(result.includes).toStrictEqual([]);
            expect(result.skip).toStrictEqual(2);
            expect(result.limit).toStrictEqual(1);
        } catch (error) {
            fail(error);
        }
    });

    test('oData parser returns error with bad data', async () => {
        try {
            const query = {
                $filter: 'count eq 2',
                $select: 'x',
                $skip: 2,
                $top: 1,
                $orderby: 'timestamp dsc'
            };
            await helper.parseOdataQuery(query);
            fail(new Error('oData parse did not return error as expected'));
        } catch (error) {
            expect(error.isBoom).toBe(true);
            expect(error.output.statusCode).toBe(400);
            expect(error.output.payload.statusCode).toBe(400);
            expect(error.output.payload.message).toBe('Check your oData inputs');
        }
    });
});

describe('Test connectjs', () => {
    test('ensure mongoose options are correct', async () => {
        try {
            const mongoOptions = {
                connectTimeoutMS: 10000
            };
            const result = connect.connectOptions();
            expect(result).toStrictEqual(mongoOptions);
        } catch (error) {
            fail(error);
        }
    });
});