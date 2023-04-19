import {jest} from '@jest/globals'
import Model from '../api/logging/data/model';
import log from '../api/logging/logic';
import { fail } from './testhelper.js';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const mockingoose = require('mockingoose')


const oneLog = {
    "thrown": "1970-01-15T06:56:07.890Z",
    "code": "ERROR",
    "message": "TEST",
    "details": {
        "test": "test"
    },
    "_id": "4dd31c2c-be8b-4f96-8d30-40ce1b0a42fb"
};

const multiLogs = [
    {
        "thrown": "1970-01-15T06:56:07.890Z",
        "code": "ERROR",
        "message": "TEST",
        "details": {
            "test": "test"
        },
        "_id": "4dd31c2c-be8b-4f96-8d30-40ce1b0a42fb"
    },
    {
        "thrown": "1970-01-15T06:56:07.890Z",
        "code": "NOTIFY",
        "message": "TEST 2",
        "details": {
            "test": "test 2"
        },
        "_id": "4dd31c2c-be8b-4f96-8d30-40ce1b0a42ec"
    }
];

describe('Log DAL tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockingoose.resetAll();
        Model.Query.prototype.findOne.mockClear();
    });

    it('write a log', async () => {
        try {
            const expected = JSON.parse(JSON.stringify(oneLog));
            expected.id = expected._id;
            delete expected._id;
            mockingoose(Model).toReturn(oneLog, 'save');
            const data = {
                "code": "ERROR",
                "message": "TEST",
                "details": {
                    "test": "test"
                }
            };
            const result = await log.write(data);
            console.info(result);
            expect(Model.prototype.save).toHaveBeenCalled();
            const res = JSON.parse(JSON.stringify(result));
            expect(res).toMatchObject(expected);
        } catch (error) {
            fail(error);
        }

    });

    it('get one log', async () => {
        try {
            const expected = JSON.parse(JSON.stringify(oneLog));
            expected.id = expected._id;
            delete expected._id;
            mockingoose(Model).toReturn(oneLog, 'findOne');
            const result = await log.getOne(oneLog._id);
            expect(Model.Query.prototype.findOne).toHaveBeenCalledWith({ _id: oneLog._id });
            const res = JSON.parse(JSON.stringify(result));
            expect(res).toMatchObject(expected);
        } catch (error) {
            fail(error);
        }
    });

    it('get logs', async () => {
        try {
            const expected = JSON.parse(JSON.stringify(multiLogs));
            expected[0].id = expected[0]._id;
            expected[1].id = expected[1]._id;
            delete expected[0]._id;
            delete expected[1]._id;
            mockingoose(Model).toReturn(multiLogs, 'find');
            const q = { $filter: "code eq 'ERROR'" };
            const result = await log.get(q);
            expect(Model.Query.prototype.find).toHaveBeenCalledWith({ code: 'ERROR' });
            const res = JSON.parse(JSON.stringify(result));
            expect(res).toMatchObject(expected);
        } catch (error) {
            fail(error);
        }
    });

    it('patch log', async () => {
        try {
            const expected = JSON.parse(JSON.stringify(oneLog));
            expected.message = "new message";
            mockingoose(Model).toReturn(expected, 'findOneAndReplace');
            mockingoose(Model).toReturn(oneLog, 'findOne');
            expected.id = expected._id;
            delete expected._id;
            const update = [
                {
                    "op":"replace",
                    "path":"/message",
                    "value": expected.message
                }
            ];
            const result = await log.patch(oneLog._id, update);
            expect(Model.Query.prototype.findOne).toHaveBeenCalledWith({ _id: oneLog._id });
            expect(Model.Query.prototype.findOneAndReplace).toHaveBeenCalledWith({ "_id": oneLog._id }, expected, { "new": true, "overwrite": true});
            const res = JSON.parse(JSON.stringify(result));
            expect(res.message).toBe(expected.message);
        } catch (error) {
            fail(error);
        }
    });

});