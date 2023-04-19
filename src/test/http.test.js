import {jest} from '@jest/globals'
import request from 'supertest';
import app from '../app';
import openApi from "../swagger";
import { fail } from './testhelper.js';
import { config } from '../config.js';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pJson = require('../../package');

describe('API tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404', async () => {
        try {
            const res = await request(app)
                .get('/api/xyz');
            expect(res.statusCode).toEqual(404);
        } catch (error) {
            fail(error);
        }

    });

    it('should parse and returns swagger as json', async () => {
        try {
            const swag = await openApi.init();
            swag.info.version = pJson.version;
            swag.info.title = pJson.name;
            swag.info.description = `${pJson.description} by: <a href="${pJson.url}">${pJson.author}</a>`;
            swag.info['x-logo'].url = pJson.logo;
            if (config.SWAGGER) swag.servers = [{url: `${config.PROTOCOL}://${config.SWAGGER}/api`}];
            const res = await request(app)
                .get('/swagger.json');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toStrictEqual(swag);
        } catch (error) {
            fail(error);
        }
    });

    it('health should work', async () => {
        try {
            const res = await request(app)
                .get('/api/health');
            expect(res.statusCode).toEqual(200);
            expect(res.body.server).toStrictEqual('running');
        } catch (error) {
            fail(error);
        }
    });

    it('version should work', async () => {
        try {
            const res = await request(app)
                .get('/api/version');
            expect(res.statusCode).toEqual(200);
            const date = new Date();
            expect(res.body).toStrictEqual({
                data: {
                    api: pJson.name,
                    version: pJson.version,
                    copyright: `Copyright (c) ${date.getFullYear()} ${pJson.author}`
                }
            });
        } catch (error) {
            fail(error);
        }
    });
});