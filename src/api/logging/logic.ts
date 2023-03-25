import jsonPatch from 'jsonpatch';
import dal from './dal';
import helper from '../../helper';
import { IODataParams } from "../../types";
import { LogObject } from "./data/type";

export default {
    async writeLog(data: any): Promise<LogObject> {
        const logData: LogObject = data;
        logData.code = data.code.toUpperCase();
        if(!logData.thrown) logData.thrown = Date.now();
        return dal.writeLogObject(logData);
    },

    async getLogs(q: IODataParams): Promise<LogObject[]> {
        const query = await helper.parseOdataQuery(q);
        return dal.getLogs(query);
    },

    async getLog(id: string): Promise<LogObject> {
        return dal.getLog(id);
    },

    async patchLog(id: string, update: any[]): Promise<LogObject> {
        const log = await dal.getLog(id);
        const patched: LogObject = jsonPatch.apply_patch(JSON.parse(JSON.stringify(log)), update);
        return dal.patchLog(id, patched);
    }
};